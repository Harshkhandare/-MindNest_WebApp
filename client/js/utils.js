import { API_BASE_URL, TOKEN_KEY, USER_KEY } from './config.js';

// Token management - Hybrid approach: HttpOnly cookie + localStorage for Socket.IO
export const getAuthToken = () => {
  // Try to get from localStorage (for Socket.IO)
  return localStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token) => {
  // Store in localStorage for Socket.IO access
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  // Cookie will be cleared by backend on logout
};

export const getCurrentUser = () => JSON.parse(localStorage.getItem(USER_KEY) || '{}');
export const setCurrentUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user));
export const removeCurrentUser = () => localStorage.removeItem(USER_KEY);

// API calls with credentials for cookie support
export const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };
  
  // Add timeout for slow networks
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include', // Include cookies
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      let errorMessage = 'Something went wrong';
      try {
        const error = await response.json();
        errorMessage = error.message || errorMessage;
      } catch (e) {
        // User-friendly error messages based on status
        if (response.status === 401) {
          errorMessage = 'Please login to continue';
        } else if (response.status === 403) {
          errorMessage = 'You don\'t have permission to perform this action';
        } else if (response.status === 404) {
          errorMessage = 'Resource not found';
        } else if (response.status === 500) {
          errorMessage = 'Server error. Please try again later';
        } else if (response.status >= 500) {
          errorMessage = 'Server error. Please try again later';
        } else {
          errorMessage = `Error: ${response.status} ${response.statusText}`;
        }
      }
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Handle network errors
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection and try again.');
    } else if (error.message === 'Failed to fetch') {
      throw new Error('Network error. Please check your connection and try again.');
    }
    
    console.error('API Error:', error);
    throw error;
  }
};

// Skeleton Loaders - Professional loading states
export const createSkeletonCard = (count = 3) => {
  return Array(count).fill(0).map(() => `
    <div class="card skeleton-card animate-fade-in">
      <div class="skeleton skeleton-title"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text" style="width: 80%"></div>
      <div class="skeleton skeleton-text" style="width: 60%"></div>
    </div>
  `).join('');
};

export const createSkeletonList = (count = 5) => {
  return Array(count).fill(0).map(() => `
    <div class="card skeleton-card animate-fade-in mb-4">
      <div class="flex items-center gap-4">
        <div class="skeleton skeleton-avatar"></div>
        <div class="flex-1">
          <div class="skeleton skeleton-text mb-2" style="width: 40%"></div>
          <div class="skeleton skeleton-text" style="width: 80%"></div>
        </div>
      </div>
    </div>
  `).join('');
};

export const showSkeleton = (container, type = 'card', count = 3) => {
  if (!container) return;
  const skeleton = type === 'list' ? createSkeletonList(count) : createSkeletonCard(count);
  container.innerHTML = skeleton;
};

// Toast notifications - Enhanced with icons
export const showToast = (message, type = 'success') => {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  
  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠'
  };
  
  toast.innerHTML = `
    <span style="font-size: 1.25rem; font-weight: bold;">${icons[type] || icons.info}</span>
    <span>${message}</span>
  `;
  
  document.body.appendChild(toast);
  
  // Trigger animation
  requestAnimationFrame(() => {
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
  });
  
  // Auto-remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};

// Date formatting
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Check authentication
export const checkAuth = () => {
  const token = getAuthToken();
  return !!token;
};

// Redirect if not authenticated
export const requireAuth = () => {
  const token = getAuthToken();
  if (!token) {
    const publicPages = ['index.html', 'login.html', 'signup.html'];
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    if (!publicPages.includes(currentPage)) {
      console.log('Not authenticated - some features may not work');
      return false;
    }
    return false;
  }
  return true;
};

// Logout with API call to clear cookie and confirmation
export const logout = async (showConfirmDialog = true) => {
  if (showConfirmDialog) {
    showConfirmation({
      title: 'Logout',
      message: 'Are you sure you want to logout? You\'ll need to login again to access your data.',
      type: 'warning',
      confirmText: 'Yes, Logout',
      cancelText: 'Cancel',
      onConfirm: async () => {
        await performLogout();
      }
    });
  } else {
    await performLogout();
  }
};

const performLogout = async () => {
  try {
    // Show loading state
    showToast('Logging out...', 'info');
    
    // Call logout endpoint to clear HttpOnly cookie
    await apiCall('/auth/logout', { method: 'POST' });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    removeAuthToken();
    removeCurrentUser();
    
    // Disconnect Socket.IO
    const { getSocket } = await import('./socket-client.js');
    const socket = getSocket();
    if (socket) {
      socket.disconnect();
    }
    
    // Show farewell message
    showToast('You\'ve been logged out. Take care! 💙', 'success');
    
    // Redirect after brief delay
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 800);
  }
};

// Character counter
export const setupCharCounter = (textarea, counterElement, maxLength) => {
  const updateCounter = () => {
    const remaining = maxLength - textarea.value.length;
    counterElement.textContent = `${textarea.value.length}/${maxLength} characters`;
    if (remaining < 50) {
      counterElement.classList.add('text-warning');
    } else {
      counterElement.classList.remove('text-warning');
    }
  };
  
  textarea.addEventListener('input', updateCounter);
  updateCounter();
};

// Loading state management
export const setLoading = (element, isLoading) => {
  if (element) {
    if (isLoading) {
      element.disabled = true;
      element.classList.add('opacity-50', 'cursor-not-allowed');
      if (element.dataset.originalText) {
        element.dataset.originalText = element.textContent;
        element.textContent = 'Loading...';
      }
    } else {
      element.disabled = false;
      element.classList.remove('opacity-50', 'cursor-not-allowed');
      if (element.dataset.originalText) {
        element.textContent = element.dataset.originalText;
      }
    }
  }
};

// Error handling
export const handleApiError = (error, defaultMessage = 'An error occurred') => {
  const message = error.message || defaultMessage;
  showToast(message, 'error');
  console.error('API Error:', error);
  return message;
};

// ============================================
// MODAL UTILITIES - Professional Dialogs
// ============================================
export const showModal = (options) => {
  const {
    title,
    message,
    type = 'info', // info, warning, danger, success
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    showCancel = true,
    onConfirm,
    onCancel
  } = options;

  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'modal-title');
  modal.setAttribute('aria-describedby', 'modal-message');

  const icons = {
    info: 'ℹ️',
    warning: '⚠️',
    danger: '🗑️',
    success: '✓'
  };

  const colors = {
    info: 'var(--info-500)',
    warning: 'var(--warning-500)',
    danger: 'var(--error-500)',
    success: 'var(--success-500)'
  };

  modal.innerHTML = `
    <div class="modal" style="max-width: 400px;">
      <div class="p-6">
        <div class="flex items-center gap-4 mb-4">
          <span style="font-size: 2rem;">${icons[type] || icons.info}</span>
          <h3 id="modal-title" class="text-2xl font-bold" style="color: var(--text-primary);">${title}</h3>
        </div>
        <p id="modal-message" class="mb-6" style="color: var(--text-secondary);">${message}</p>
        <div class="flex gap-3 justify-end">
          ${showCancel ? `
            <button class="btn-secondary btn-sm" id="modal-cancel">
              ${cancelText}
            </button>
          ` : ''}
          <button 
            class="btn-primary btn-sm" 
            id="modal-confirm"
            style="background: ${colors[type]};"
          >
            ${confirmText}
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  modal.style.display = 'flex';

  // Focus management
  const confirmBtn = modal.querySelector('#modal-confirm');
  const cancelBtn = modal.querySelector('#modal-cancel');
  confirmBtn.focus();

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on Escape key
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  };
  document.addEventListener('keydown', handleEscape);

  const closeModal = () => {
    modal.style.animation = 'fadeOut 200ms ease-out';
    setTimeout(() => {
      document.removeEventListener('keydown', handleEscape);
      modal.remove();
    }, 200);
  };

  // Event handlers
  confirmBtn.addEventListener('click', () => {
    if (onConfirm) onConfirm();
    closeModal();
  });

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      if (onCancel) onCancel();
      closeModal();
    });
  }

  return { close: closeModal };
};

// Confirmation dialog helper
export const showConfirmation = (options) => {
  return showModal({
    ...options,
    type: options.type || 'warning',
    showCancel: true
  });
};

// Loading state helper for buttons
export const setButtonLoading = (button, isLoading, loadingText = 'Loading...') => {
  if (!button) return;
  
  if (isLoading) {
    button.disabled = true;
    button.classList.add('loading');
    if (!button.dataset.originalText) {
      button.dataset.originalText = button.textContent;
    }
    button.innerHTML = `<span class="loading-spinner"></span> ${loadingText}`;
  } else {
    button.disabled = false;
    button.classList.remove('loading');
    button.textContent = button.dataset.originalText || button.textContent;
    delete button.dataset.originalText;
  }
};
