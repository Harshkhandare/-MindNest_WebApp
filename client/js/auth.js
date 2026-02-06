import { apiCall, setAuthToken, setCurrentUser, showToast, getAuthToken, setButtonLoading } from './utils.js';
import { initSocket } from './socket-client.js';

// Signup
export const handleSignup = async (formData, submitButton) => {
  try {
    setButtonLoading(submitButton, true, 'Creating Account...');
    
    const data = await apiCall('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName
      })
    });
    
    // Token is now in HttpOnly cookie, but we also store in localStorage for Socket.IO
    // Backend sends token in response for initial setup
    if (data.token) {
      setAuthToken(data.token);
    }
    setCurrentUser(data.user);
    
    // Show success message with user name
    const userName = data.user.firstName || data.user.username || 'there';
    showToast(`Welcome to MindNest, ${userName}! 🎉`, 'success');
    
    // Initialize Socket.IO
    initSocket();
    
    // Smooth transition to dashboard
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 500);
  } catch (error) {
    setButtonLoading(submitButton, false);
    showToast(error.message || 'Signup failed. Please try again.', 'error');
    throw error;
  }
};

// Login
export const handleLogin = async (formData, submitButton) => {
  try {
    setButtonLoading(submitButton, true, 'Logging in...');
    
    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: formData.email,
        password: formData.password
      })
    });
    
    // Token is in HttpOnly cookie, store in localStorage for Socket.IO
    if (data.token) {
      setAuthToken(data.token);
    }
    setCurrentUser(data.user);
    
    // Personalized welcome message
    const userName = data.user.firstName || data.user.username || 'there';
    const timeOfDay = new Date().getHours() < 12 ? 'morning' : 
                      new Date().getHours() < 17 ? 'afternoon' : 'evening';
    showToast(`Good ${timeOfDay}, ${userName}! Welcome back. 🌟`, 'success');
    
    // Initialize Socket.IO
    initSocket();
    
    // Smooth transition to dashboard
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 500);
  } catch (error) {
    setButtonLoading(submitButton, false);
    showToast(error.message || 'Invalid credentials. Please check your email and password.', 'error');
    throw error;
  }
};

// Initialize auth pages
if (document.getElementById('signup-form')) {
  document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitButton = e.target.querySelector('button[type="submit"]');
    const formData = {
      username: document.getElementById('username').value,
      email: document.getElementById('email').value,
      password: document.getElementById('password').value,
      firstName: document.getElementById('firstName')?.value,
      lastName: document.getElementById('lastName')?.value
    };
    await handleSignup(formData, submitButton);
  });
}

if (document.getElementById('login-form')) {
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitButton = e.target.querySelector('button[type="submit"]');
    const formData = {
      email: document.getElementById('email').value,
      password: document.getElementById('password').value
    };
    await handleLogin(formData, submitButton);
  });
}

// Check if already logged in
document.addEventListener('DOMContentLoaded', () => {
  const token = getAuthToken();
  const currentPage = window.location.pathname.split('/').pop();
  
  // If logged in and on auth pages, redirect to dashboard
  if (token && (currentPage === 'login.html' || currentPage === 'signup.html')) {
    window.location.href = 'dashboard.html';
  }
  
  // Initialize Socket.IO if authenticated
  if (token) {
    initSocket();
  }
});
