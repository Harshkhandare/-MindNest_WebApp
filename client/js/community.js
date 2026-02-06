import { apiCall, requireAuth, showToast, formatDateTime, setupCharCounter, getCurrentUser, showSkeleton, showConfirmation } from './utils.js';
import { initSocket, getSocket } from './socket-client.js';

// Check authentication
const isAuthenticated = requireAuth();
if (!isAuthenticated) {
  console.log('Not authenticated - login to post and interact');
}

let currentFilter = 'recent';

document.addEventListener('DOMContentLoaded', async () => {
  // Show/hide "My Posts" filter based on authentication
  const myPostsFilter = document.getElementById('my-posts-filter');
  if (myPostsFilter) {
    if (!isAuthenticated) {
      myPostsFilter.style.display = 'none';
    }
  }
  // Initialize Socket.IO if authenticated
  if (isAuthenticated) {
    initSocket();
    
    // Listen for real-time community updates
    window.addEventListener('post:new', (e) => {
      const post = e.detail.post;
      if (currentFilter !== 'my-posts') {
        addPostToFeed(post);
        showToast('New post from community!', 'success');
      }
    });
    
    window.addEventListener('comment:new', (e) => {
      addCommentToPost(e.detail.postId, e.detail.comment);
      showToast('New comment!', 'success');
    });
    
    window.addEventListener('post:like-updated', (e) => {
      updatePostLikes(e.detail.postId, e.detail.likesCount, e.detail.liked);
    });
    
    window.addEventListener('post:deleted', (e) => {
      removePostFromFeed(e.detail.postId);
    });
  }
  
  // Character counter
  const postContent = document.getElementById('post-content');
  const postCharCount = document.getElementById('post-char-count');
  if (postContent && postCharCount) {
    setupCharCounter(postContent, postCharCount, 1000);
  }
  
  // Form submission
  const postForm = document.getElementById('post-form');
  if (postForm) {
    postForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = postForm.querySelector('button[type="submit"]');
      if (submitBtn && submitBtn.disabled) return;
      
      const content = postContent.value.trim();
      const isAnonymous = document.getElementById('anonymous-post').checked;
      
      if (!content) {
        showToast('Please write something', 'error');
        return;
      }
      
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sharing...';
      }
      
      try {
        await apiCall('/community', {
          method: 'POST',
          body: JSON.stringify({ content, isAnonymous })
        });
        
        showToast('Post shared successfully!', 'success');
        postForm.reset();
        if (postCharCount) postCharCount.textContent = '0/1000';
        // Post will appear via Socket.IO event
        await loadPosts();
      } catch (error) {
        showToast(error.message || 'Failed to share post', 'error');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Share';
        }
      }
    });
  }
  
  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      // Prevent multiple clicks
      if (btn.disabled) return;
      
      // Update active state
      document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      
      // Update filter
      currentFilter = btn.dataset.filter;
      
      // Disable buttons during load
      document.querySelectorAll('.filter-btn').forEach(b => b.disabled = true);
      btn.textContent = btn.textContent.trim() + '...';
      
      try {
        // Reload posts with new filter
        await loadPosts();
        const filterText = currentFilter === 'recent' ? 'recent' : 
                          currentFilter === 'popular' ? 'popular' : 
                          'my posts';
        showToast(`Showing ${filterText}`, 'info');
      } catch (error) {
        showToast('Failed to load posts', 'error');
      } finally {
        // Re-enable buttons
        document.querySelectorAll('.filter-btn').forEach(b => {
          b.disabled = false;
          const filter = b.dataset.filter;
          if (filter === 'recent') {
            b.textContent = 'Recent';
          } else if (filter === 'popular') {
            b.textContent = 'Popular';
          } else if (filter === 'my-posts') {
            b.textContent = 'My Posts';
          }
        });
      }
    });
  });
  
  // Load posts
  await loadPosts();
});

// Real-time update functions
window.addPostToFeed = function(post) {
  const container = document.getElementById('posts-container');
  if (!container) return;
  
  const currentUser = getCurrentUser();
  const postId = post.id || post._id;
  const isLiked = post.isLiked || false;
  const isOwner = currentUser && post.userId === currentUser.id;
  
  const postCard = createPostCard(post, isLiked, isOwner);
  container.insertAdjacentHTML('afterbegin', postCard);
  attachPostListeners();
};

window.addCommentToPost = function(postId, comment) {
  const commentsList = document.querySelector(`.comments-list[data-post-id="${postId}"]`);
  if (!commentsList) return;
  
  const commentAuthor = comment.isAnonymous ? 'Anonymous' : (comment.author || 'User');
  const commentHTML = `
    <div class="comment mb-3 p-3 bg-gray-50 rounded-lg">
      <div class="flex items-center space-x-2 mb-1">
        <span class="font-semibold text-sm">${commentAuthor}</span>
        <time class="text-xs text-gray-500">${formatDateTime(comment.createdAt)}</time>
      </div>
      <p class="text-sm text-gray-700">${comment.content}</p>
    </div>
  `;
  commentsList.insertAdjacentHTML('beforeend', commentHTML);
  
  // Update comment count
  const commentBtn = document.querySelector(`.comment-btn[data-id="${postId}"]`);
  if (commentBtn) {
    const countSpan = commentBtn.querySelector('span:last-child');
    if (countSpan) {
      const currentCount = parseInt(countSpan.textContent) || 0;
      countSpan.textContent = currentCount + 1;
    }
  }
};

window.updatePostLikes = function(postId, likesCount, liked) {
  const likeBtn = document.querySelector(`.like-btn[data-id="${postId}"]`);
  if (!likeBtn) return;
  
  const countSpan = likeBtn.querySelector('.like-count');
  if (countSpan) {
    countSpan.textContent = likesCount;
  }
  
  if (liked) {
    likeBtn.classList.add('text-red-600');
    likeBtn.classList.remove('text-gray-600');
    likeBtn.setAttribute('aria-pressed', 'true');
  } else {
    likeBtn.classList.remove('text-red-600');
    likeBtn.classList.add('text-gray-600');
    likeBtn.setAttribute('aria-pressed', 'false');
  }
};

window.removePostFromFeed = function(postId) {
  const postCard = document.querySelector(`.post-card[data-id="${postId}"]`);
  if (postCard) {
    postCard.remove();
  }
};

async function loadPosts() {
  try {
    const container = document.getElementById('posts-container');
    if (!container) return;
    
    // Show skeleton loader
    showSkeleton(container, 'list', 3);
    
    let data;
    try {
      data = await apiCall(`/community?filter=${currentFilter}`);
    } catch (apiError) {
      console.error('API Error details:', apiError);
      
      // Check if it's an authentication error
      if (apiError.message && apiError.message.includes('Authentication')) {
        container.innerHTML = `
          <div class="text-center py-12">
            <div class="text-6xl mb-4">🔒</div>
            <p class="text-lg text-gray-600 mb-4">Please log in to view posts</p>
            <a href="login.html" class="btn-primary inline-block">Login</a>
          </div>
        `;
        return;
      }
      
      // Check if it's a database connection error
      if (apiError.message && apiError.message.includes('Database not connected')) {
        container.innerHTML = `
          <div class="text-center py-12">
            <div class="text-6xl mb-4">⚠️</div>
            <p class="text-lg text-red-600 mb-2">Database connection error</p>
            <p class="text-gray-600">Please contact support or try again later.</p>
          </div>
        `;
        showToast('Database connection error', 'error');
        return;
      }
      
      // Generic error
      container.innerHTML = `
        <div class="text-center py-12">
          <div class="text-6xl mb-4">😕</div>
          <p class="text-lg text-red-600 mb-2">Unable to load posts</p>
          <p class="text-gray-600">${apiError.message || 'Please try again later.'}</p>
        </div>
      `;
      showToast(apiError.message || 'Failed to load posts', 'error');
      throw apiError;
    }
    
    if (!data || !data.posts) {
      container.innerHTML = `
        <div class="text-center py-12">
          <div class="text-6xl mb-4">📭</div>
          <p class="text-lg text-gray-600">No posts data received</p>
          <p class="text-sm text-gray-500 mt-2">Please try refreshing the page.</p>
        </div>
      `;
      return;
    }
    
    if (data.posts.length === 0) {
      let emptyContent;
      if (currentFilter === 'popular') {
        emptyContent = `
          <div class="text-center py-12">
            <div class="text-6xl mb-4">⭐</div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">No popular posts yet</h3>
            <p class="text-gray-600 mb-6">Be the first to like a post and help it become popular!</p>
            <a href="#create-post" class="btn-primary inline-block">Create First Post</a>
          </div>
        `;
      } else if (currentFilter === 'my-posts') {
        emptyContent = `
          <div class="text-center py-12">
            <div class="text-6xl mb-4">📝</div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">You haven't posted anything yet</h3>
            <p class="text-gray-600 mb-6">Share your thoughts and connect with the community.</p>
            <a href="#create-post" class="btn-primary inline-block">Share Your First Post</a>
          </div>
        `;
      } else {
        emptyContent = `
          <div class="text-center py-12">
            <div class="text-6xl mb-4">💬</div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">No posts yet</h3>
            <p class="text-gray-600 mb-6">Start the conversation! Share your thoughts and connect with others.</p>
            <a href="#create-post" class="btn-primary inline-block">Create First Post</a>
          </div>
        `;
      }
      container.innerHTML = emptyContent;
      return;
    }
    
    const currentUser = getCurrentUser();
    
    container.innerHTML = data.posts.map(post => {
      const postId = post.id || post._id;
      const isLiked = post.isLiked !== undefined ? post.isLiked : false;
      const isOwner = post.userId && currentUser.id && (post.userId.toString() === currentUser.id.toString());
      
      return createPostCard(post, isLiked, isOwner);
    }).join('');
    
    attachPostListeners();
  } catch (error) {
    console.error('Error loading posts:', error);
    const container = document.getElementById('posts-container');
    if (container) {
      const errorMessage = error.message || 'Unable to load posts. Please try again.';
      container.innerHTML = `<p class="text-red-500 text-center py-8">${errorMessage}</p>`;
      showToast(errorMessage, 'error');
    }
    throw error; // Re-throw so filter button handler can catch it
  }
}

function createPostCard(post, isLiked, isOwner) {
  const authorName = post.isAnonymous ? 'Anonymous User' : (post.author || 'User');
  const likeCount = post.likesCount !== undefined ? post.likesCount : (post.likes ? post.likes.length : 0);
  const commentCount = post.comments ? post.comments.length : 0;
  const postId = post.id || post._id;
  
  return `
    <article class="card post-card" role="listitem" data-id="${postId}">
      <header class="flex items-center space-x-3 mb-4">
        <span class="text-2xl">👤</span>
        <div>
          <span class="font-semibold">${authorName}</span>
          <time class="text-sm text-gray-500 ml-2">${formatDateTime(post.createdAt)}</time>
        </div>
      </header>
      
      <div class="post-content mb-4">
        <p class="text-gray-700 whitespace-pre-wrap">${post.content}</p>
      </div>
      
      <footer class="flex items-center space-x-4 pt-4 border-t border-gray-200">
        <button 
          class="like-btn flex items-center space-x-2 ${isLiked ? 'text-red-600' : 'text-gray-600'} hover:text-red-600"
          data-id="${postId}"
          aria-label="Like this post"
          aria-pressed="${isLiked}"
        >
          <span>❤️</span>
          <span class="like-count">${likeCount}</span>
        </button>
        <button 
          class="comment-btn flex items-center space-x-2 text-gray-600 hover:text-purple-600"
          data-id="${postId}"
          aria-label="Comment on this post"
        >
          <span>💬</span>
          <span>${commentCount}</span>
        </button>
        ${isOwner ? `
          <button 
            class="delete-post-btn text-red-600 hover:text-red-700 ml-auto"
            data-id="${postId}"
            aria-label="Delete your post"
          >
            🗑️ Delete
          </button>
        ` : ''}
      </footer>
      
      <div class="comments-section mt-4 hidden" data-post-id="${postId}">
        <div class="comment-form mb-4">
          <textarea 
            class="input-field text-sm"
            rows="2"
            placeholder="Write a comment..."
            data-post-id="${postId}"
          ></textarea>
          <button class="btn-secondary mt-2 submit-comment" data-post-id="${postId}">
            Comment
          </button>
        </div>
        <div class="comments-list" data-post-id="${postId}">
          ${post.comments && post.comments.length > 0 ? 
            post.comments.map(comment => {
              const commentAuthor = comment.isAnonymous ? 'Anonymous' : 
                (comment.author || 'User');
              return `
                <div class="comment mb-3 p-3 bg-gray-50 rounded-lg">
                  <div class="flex items-center space-x-2 mb-1">
                    <span class="font-semibold text-sm">${commentAuthor}</span>
                    <time class="text-xs text-gray-500">${formatDateTime(comment.createdAt)}</time>
                  </div>
                  <p class="text-sm text-gray-700">${comment.content}</p>
                </div>
              `;
            }).join('') : '<p class="text-sm text-gray-500">No comments yet.</p>'
          }
        </div>
      </div>
    </article>
  `;
}

function attachPostListeners() {
  // Like buttons
  document.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      if (btn.disabled) return;
      
      btn.disabled = true;
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<span>⏳</span>';
      
      try {
        await apiCall(`/community/${id}/like`, { method: 'POST' });
        // Update will come via Socket.IO
      } catch (error) {
        showToast(error.message || 'Failed to like post', 'error');
        btn.innerHTML = originalHTML;
        btn.disabled = false;
      }
    });
  });
  
  // Comment buttons
  document.querySelectorAll('.comment-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const postId = btn.dataset.id;
      const commentsSection = document.querySelector(`.comments-section[data-post-id="${postId}"]`);
      if (commentsSection) {
        commentsSection.classList.toggle('hidden');
      }
    });
  });
  
  // Submit comment
  document.querySelectorAll('.submit-comment').forEach(btn => {
    btn.addEventListener('click', async () => {
      const postId = btn.dataset.id;
      if (btn.disabled) return;
      
      const textarea = document.querySelector(`textarea[data-post-id="${postId}"]`);
      const content = textarea.value.trim();
      
      if (!content) {
        showToast('Please write a comment', 'error');
        return;
      }
      
      btn.disabled = true;
      btn.textContent = 'Posting...';
      
      try {
        await apiCall(`/community/${postId}/comment`, {
          method: 'POST',
          body: JSON.stringify({ content, isAnonymous: true })
        });
        
        showToast('Comment added!', 'success');
        textarea.value = '';
        // Comment will appear via Socket.IO
      } catch (error) {
        showToast(error.message || 'Failed to add comment', 'error');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Comment';
      }
    });
  });
  
  // Delete post
  document.querySelectorAll('.delete-post-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      if (btn.disabled) return;
      
      showConfirmation({
        title: 'Delete Post',
        message: 'Are you sure you want to delete this post? This action cannot be undone.',
        type: 'danger',
        confirmText: 'Yes, Delete',
        cancelText: 'Cancel',
        onConfirm: async () => {
          setButtonLoading(btn, true, 'Deleting...');
          
          try {
            await apiCall(`/community/${id}`, { method: 'DELETE' });
            showToast('Post deleted', 'success');
            // Post will be removed via Socket.IO
          } catch (error) {
            setButtonLoading(btn, false);
            showToast(error.message || 'Failed to delete post', 'error');
          }
        }
      });
    });
  });
}
