const Post = require('../models/Post');
const User = require('../models/User');
const { getPool } = require('../config/db');
const { validationResult } = require('express-validator');

exports.createPost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const pool = getPool();
    if (!pool) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    const { content, isAnonymous, tags } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Post content is required' });
    }

    if (content.length > 1000) {
      return res.status(400).json({ message: 'Post content must be less than 1000 characters' });
    }

    const post = await Post.create({
      userId: req.user.id,
      content: content.trim(),
      isAnonymous: isAnonymous !== false,
      tags: tags || []
    });

    // Get user info (but hide if anonymous)
    const user = await User.findById(req.user.id);
    const postResponse = {
      ...post,
      author: post.isAnonymous ? 'Anonymous User' : (user ? user.username : 'Unknown')
    };

    // Emit real-time update to all users
    const io = req.app.get('io');
    if (io) {
      io.emit('post:new', { post: postResponse });
    }

    res.status(201).json({ message: 'Post created successfully', post: postResponse });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: error.message || 'Failed to create post' });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    const { page = 1, limit = 20, filter = 'recent' } = req.query;
    let options = { limit: parseInt(limit) };

    // Only filter by userId if user is authenticated and requesting my-posts
    if (filter === 'my-posts') {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Authentication required to view your posts' });
      }
      options.userId = req.user.id;
    }

    let posts = await Post.findAll(options);

    // Sort by filter
    if (filter === 'popular') {
      // Sort by likes count (descending), then by date (newest first)
      posts.sort((a, b) => {
        const likesA = a.likesCount || 0;
        const likesB = b.likesCount || 0;
        
        if (likesB !== likesA) {
          return likesB - likesA; // More likes first
        }
        // If same likes, newest first
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    } else if (filter === 'recent') {
      // Sort by date (newest first)
      posts.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    }

    // Get user info for each post and check if current user liked it
    for (const post of posts) {
      try {
        const user = await User.findById(post.userId);
        post.author = post.isAnonymous ? 'Anonymous User' : (user ? user.username : 'Unknown');
        
        // Check if current user liked this post
        if (req.user && req.user.id) {
          try {
            const [userLike] = await pool.execute(
              'SELECT * FROM post_likes WHERE postId = ? AND userId = ?',
              [post.id, req.user.id]
            );
            post.isLiked = userLike.length > 0;
          } catch (likeError) {
            console.error('Error checking like status:', likeError);
            post.isLiked = false;
          }
        } else {
          post.isLiked = false;
        }
        
        // Get user info for comments
        if (post.comments && Array.isArray(post.comments)) {
          for (const comment of post.comments) {
            try {
              const commentUser = await User.findById(comment.userId);
              comment.author = comment.isAnonymous ? 'Anonymous User' : (commentUser ? commentUser.username : 'Unknown');
            } catch (commentError) {
              console.error('Error loading comment author:', commentError);
              comment.author = comment.isAnonymous ? 'Anonymous User' : 'Unknown';
            }
          }
        }
      } catch (postError) {
        console.error('Error processing post:', postError);
        // Continue with default values
        post.author = post.isAnonymous ? 'Anonymous User' : 'Unknown';
        post.isLiked = false;
      }
    }

    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedPosts = posts.slice(startIndex, endIndex);

    res.json({
      posts: paginatedPosts,
      totalPages: Math.ceil(posts.length / parseInt(limit)),
      currentPage: parseInt(page),
      total: posts.length
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const user = await User.findById(post.userId);
    post.author = post.isAnonymous ? 'Anonymous User' : (user ? user.username : 'Unknown');

    res.json({ post });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    const result = await Post.toggleLike(req.params.id, req.user.id);

    const post = await Post.findById(req.params.id);
    
    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.emit('post:like-updated', {
        postId: req.params.id,
        likesCount: post.likesCount,
        liked: result.liked
      });
    }

    res.json({ message: result.liked ? 'Post liked' : 'Post unliked', post });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    const { content, isAnonymous } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    if (content.length > 500) {
      return res.status(400).json({ message: 'Comment must be less than 500 characters' });
    }

    const comment = await Post.addComment(
      req.params.id,
      req.user.id,
      content.trim(),
      isAnonymous !== false
    );

    const post = await Post.findById(req.params.id);
    const user = await User.findById(req.user.id);
    
    const commentResponse = {
      ...comment,
      author: comment.isAnonymous ? 'Anonymous User' : (user ? user.username : 'Unknown')
    };

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.emit('comment:new', {
        postId: req.params.id,
        comment: commentResponse
      });
    }

    res.json({ message: 'Comment added successfully', post, comment: commentResponse });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    const deleted = await Post.delete(req.params.id, req.user.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Post not found or unauthorized' });
    }

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.emit('post:deleted', { postId: req.params.id });
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: error.message });
  }
};
