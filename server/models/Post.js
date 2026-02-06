const { getPool } = require('../config/db');

class Post {
  static async create(postData) {
    const pool = getPool();
    if (!pool) throw new Error('Database not connected');

    const { userId, content, isAnonymous, tags } = postData;

    const [result] = await pool.execute(
      `INSERT INTO posts (userId, content, isAnonymous) 
       VALUES (?, ?, ?)`,
      [userId, content, isAnonymous !== undefined ? isAnonymous : true]
    );

    const postId = result.insertId;

    // Add tags if provided
    if (tags && tags.length > 0) {
      for (const tag of tags) {
        await pool.execute(
          'INSERT INTO post_tags (postId, tag) VALUES (?, ?)',
          [postId, tag]
        );
      }
    }

    return await this.findById(postId);
  }

  static async findById(id) {
    const pool = getPool();
    if (!pool) throw new Error('Database not connected');

    const [rows] = await pool.execute('SELECT * FROM posts WHERE id = ?', [id]);
    if (!rows[0]) return null;

    const post = rows[0];

    // Get likes
    const [likes] = await pool.execute(
      'SELECT userId FROM post_likes WHERE postId = ?',
      [id]
    );
    post.likes = likes.map(l => l.userId);
    post.likesCount = likes.length;

    // Get comments
    const [comments] = await pool.execute(
      'SELECT * FROM post_comments WHERE postId = ? ORDER BY createdAt ASC',
      [id]
    );
    post.comments = comments;

    // Get tags
    const [tags] = await pool.execute(
      'SELECT tag FROM post_tags WHERE postId = ?',
      [id]
    );
    post.tags = tags.map(t => t.tag);

    return post;
  }

  static async findAll(options = {}) {
    const pool = getPool();
    if (!pool) {
      console.error('Database pool not available');
      throw new Error('Database not connected');
    }

    try {
      let query = 'SELECT * FROM posts';
      const params = [];

      if (options.userId) {
        query += ' WHERE userId = ?';
        params.push(parseInt(options.userId));
      }

      query += ' ORDER BY createdAt DESC';

      if (options.limit) {
        const limitValue = parseInt(options.limit);
        if (!isNaN(limitValue) && limitValue > 0) {
          query += ` LIMIT ${limitValue}`;
        }
      }

      const [posts] = await pool.execute(query, params);
      
      if (!Array.isArray(posts)) {
        console.error('Posts query did not return an array:', posts);
        return [];
      }

      // Get likes, comments, and tags for each post
      for (const post of posts) {
        try {
          const [likes] = await pool.execute(
            'SELECT userId FROM post_likes WHERE postId = ?',
            [post.id]
          );
          post.likes = Array.isArray(likes) ? likes.map(l => l.userId) : [];
          post.likesCount = post.likes.length;

          const [comments] = await pool.execute(
            'SELECT * FROM post_comments WHERE postId = ? ORDER BY createdAt ASC',
            [post.id]
          );
          post.comments = Array.isArray(comments) ? comments : [];

          const [tags] = await pool.execute(
            'SELECT tag FROM post_tags WHERE postId = ?',
            [post.id]
          );
          post.tags = Array.isArray(tags) ? tags.map(t => t.tag) : [];
        } catch (postError) {
          console.error(`Error loading data for post ${post.id}:`, postError);
          // Set defaults if there's an error
          post.likes = [];
          post.likesCount = 0;
          post.comments = [];
          post.tags = [];
        }
      }

      return posts;
    } catch (error) {
      console.error('Error in Post.findAll:', error);
      console.error('Error stack:', error.stack);
      throw error;
    }
  }

  static async toggleLike(postId, userId) {
    const pool = getPool();
    if (!pool) throw new Error('Database not connected');

    // Check if already liked
    const [existing] = await pool.execute(
      'SELECT * FROM post_likes WHERE postId = ? AND userId = ?',
      [postId, userId]
    );

    if (existing.length > 0) {
      // Unlike
      await pool.execute(
        'DELETE FROM post_likes WHERE postId = ? AND userId = ?',
        [postId, userId]
      );
      return { liked: false };
    } else {
      // Like
      await pool.execute(
        'INSERT INTO post_likes (postId, userId) VALUES (?, ?)',
        [postId, userId]
      );
      return { liked: true };
    }
  }

  static async addComment(postId, userId, content, isAnonymous) {
    const pool = getPool();
    if (!pool) throw new Error('Database not connected');

    const [result] = await pool.execute(
      `INSERT INTO post_comments (postId, userId, content, isAnonymous) 
       VALUES (?, ?, ?, ?)`,
      [postId, userId, content, isAnonymous !== false]
    );

    const [comment] = await pool.execute(
      'SELECT * FROM post_comments WHERE id = ?',
      [result.insertId]
    );

    return comment[0];
  }

  static async delete(id, userId) {
    const pool = getPool();
    if (!pool) throw new Error('Database not connected');

    const [result] = await pool.execute(
      'DELETE FROM posts WHERE id = ? AND userId = ?',
      [id, userId]
    );

    return result.affectedRows > 0;
  }
}

module.exports = Post;
