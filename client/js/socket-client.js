// Socket.IO Client for Real-time Updates
import { getAuthToken } from './utils.js';

class SocketClient {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.init();
  }

  init() {
    // Only connect if user is authenticated
    const token = getAuthToken();
    if (!token) {
      return;
    }

    this.connect();
  }

  connect() {
    try {
      const token = getAuthToken();
      if (!token) return;

      // Connect to Socket.IO server
      this.socket = io(window.location.origin, {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling']
      });

      this.socket.on('connect', () => {
        console.log('✅ Socket.IO connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.onConnect();
      });

      this.socket.on('disconnect', () => {
        console.log('❌ Socket.IO disconnected');
        this.isConnected = false;
        this.onDisconnect();
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket.IO connection error:', error);
        this.handleReconnect();
      });

      // Real-time event handlers
      this.setupEventHandlers();
    } catch (error) {
      console.error('Error initializing Socket.IO:', error);
    }
  }

  setupEventHandlers() {
    if (!this.socket) return;

    // Mood updates
    this.socket.on('mood:created', (data) => {
      this.handleMoodCreated(data);
    });

    this.socket.on('mood:updated', (data) => {
      this.handleMoodUpdated(data);
    });

    this.socket.on('mood:deleted', (data) => {
      this.handleMoodDeleted(data);
    });

    // Journal updates
    this.socket.on('journal:created', (data) => {
      this.handleJournalCreated(data);
    });

    this.socket.on('journal:updated', (data) => {
      this.handleJournalUpdated(data);
    });

    this.socket.on('journal:deleted', (data) => {
      this.handleJournalDeleted(data);
    });

    // Goal updates
    this.socket.on('goal:changed', (data) => {
      this.handleGoalChanged(data);
    });

    // Community updates
    this.socket.on('post:new', (data) => {
      this.handleNewPost(data);
    });

    this.socket.on('comment:new', (data) => {
      this.handleNewComment(data);
    });

    this.socket.on('post:like-updated', (data) => {
      this.handlePostLikeUpdated(data);
    });

    this.socket.on('post:deleted', (data) => {
      this.handlePostDeleted(data);
    });

    // Reminder updates
    this.socket.on('reminder:triggered', (data) => {
      this.handleReminderTriggered(data);
    });

    this.socket.on('reminder:created', (data) => {
      this.handleReminderCreated(data);
    });

    this.socket.on('reminder:updated', (data) => {
      this.handleReminderUpdated(data);
    });

    this.socket.on('reminder:deleted', (data) => {
      this.handleReminderDeleted(data);
    });
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`🔄 Reconnecting... (Attempt ${this.reconnectAttempts})`);
        this.connect();
      }, 2000 * this.reconnectAttempts);
    }
  }

  onConnect() {
    // Dispatch custom event for other modules
    window.dispatchEvent(new CustomEvent('socket:connected'));
  }

  onDisconnect() {
    window.dispatchEvent(new CustomEvent('socket:disconnected'));
  }

  // Mood handlers
  handleMoodCreated(data) {
    window.dispatchEvent(new CustomEvent('mood:created', { detail: data }));
    if (window.updateMoodChart) {
      window.updateMoodChart(data.stats);
    }
  }

  handleMoodUpdated(data) {
    window.dispatchEvent(new CustomEvent('mood:updated', { detail: data }));
    if (window.updateMoodChart) {
      window.updateMoodChart(data.stats);
    }
  }

  handleMoodDeleted(data) {
    window.dispatchEvent(new CustomEvent('mood:deleted', { detail: data }));
    if (window.updateMoodChart) {
      window.updateMoodChart(data.stats);
    }
  }

  // Journal handlers
  handleJournalCreated(data) {
    window.dispatchEvent(new CustomEvent('journal:created', { detail: data }));
    if (window.refreshJournalList) {
      window.refreshJournalList();
    }
  }

  handleJournalUpdated(data) {
    window.dispatchEvent(new CustomEvent('journal:updated', { detail: data }));
    if (window.refreshJournalList) {
      window.refreshJournalList();
    }
  }

  handleJournalDeleted(data) {
    window.dispatchEvent(new CustomEvent('journal:deleted', { detail: data }));
    if (window.refreshJournalList) {
      window.refreshJournalList();
    }
  }

  // Goal handlers
  handleGoalChanged(data) {
    window.dispatchEvent(new CustomEvent('goal:changed', { detail: data }));
    if (window.refreshGoalsList) {
      window.refreshGoalsList();
    }
  }

  // Community handlers
  handleNewPost(data) {
    window.dispatchEvent(new CustomEvent('post:new', { detail: data }));
    if (window.addPostToFeed) {
      window.addPostToFeed(data.post);
    }
  }

  handleNewComment(data) {
    window.dispatchEvent(new CustomEvent('comment:new', { detail: data }));
    if (window.addCommentToPost) {
      window.addCommentToPost(data.postId, data.comment);
    }
  }

  handlePostLikeUpdated(data) {
    window.dispatchEvent(new CustomEvent('post:like-updated', { detail: data }));
    if (window.updatePostLikes) {
      window.updatePostLikes(data.postId, data.likesCount, data.liked);
    }
  }

  handlePostDeleted(data) {
    window.dispatchEvent(new CustomEvent('post:deleted', { detail: data }));
    if (window.removePostFromFeed) {
      window.removePostFromFeed(data.postId);
    }
  }

  // Reminder handlers
  handleReminderTriggered(data) {
    window.dispatchEvent(new CustomEvent('reminder:triggered', { detail: data }));
    
    // Show browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(data.title, {
        body: data.description || 'Time for your reminder',
        icon: '/favicon.ico',
        tag: `reminder-${data.id}`
      });
    }
  }

  handleReminderCreated(data) {
    window.dispatchEvent(new CustomEvent('reminder:created', { detail: data }));
  }

  handleReminderUpdated(data) {
    window.dispatchEvent(new CustomEvent('reminder:updated', { detail: data }));
  }

  handleReminderDeleted(data) {
    window.dispatchEvent(new CustomEvent('reminder:deleted', { detail: data }));
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    }
  }
}

// Create singleton instance
let socketInstance = null;

export const initSocket = () => {
  if (!socketInstance) {
    socketInstance = new SocketClient();
  }
  return socketInstance;
};

export const getSocket = () => {
  if (socketInstance && socketInstance.socket) {
    return socketInstance.socket;
  }
  return null;
};

// Auto-initialize on page load if authenticated
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (getAuthToken()) {
      initSocket();
    }
  });
} else {
  if (getAuthToken()) {
    initSocket();
  }
}


