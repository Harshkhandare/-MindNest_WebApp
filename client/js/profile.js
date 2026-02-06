import { apiCall, requireAuth, showToast, getCurrentUser, setCurrentUser, setButtonLoading, formatDate } from './utils.js';

// Check authentication
if (!requireAuth()) {
  // Redirect handled in utils
}

document.addEventListener('DOMContentLoaded', async () => {
  // Load user profile
  await loadProfile();
  
  // Profile form
  const profileForm = document.getElementById('profile-form');
  if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = profileForm.querySelector('button[type="submit"]');
      if (submitBtn && submitBtn.disabled) return;
      
      setButtonLoading(submitBtn, true, 'Saving...');
      
      try {
        const result = await apiCall('/user/profile', {
          method: 'PUT',
          body: JSON.stringify({
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim()
          })
        });
        
        // Update user in localStorage
        if (result.user) {
          setCurrentUser(result.user);
        }
        
        showToast('Profile updated successfully! ✨', 'success');
      } catch (error) {
        showToast(error.message || 'Failed to update profile', 'error');
      } finally {
        setButtonLoading(submitBtn, false);
      }
    });
  }
  
  // Preferences form
  const preferencesForm = document.getElementById('preferences-form');
  if (preferencesForm) {
    preferencesForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = preferencesForm.querySelector('button[type="submit"]');
      if (submitBtn && submitBtn.disabled) return;
      
      setButtonLoading(submitBtn, true, 'Saving...');
      
      try {
        await apiCall('/user/preferences', {
          method: 'PUT',
          body: JSON.stringify({
            theme: document.getElementById('theme').value,
            highContrast: document.getElementById('highContrast').checked,
            textToSpeech: document.getElementById('textToSpeech').checked,
            notifications: document.getElementById('notifications').checked
          })
        });
        
        showToast('Preferences saved! Applying changes...', 'success');
        // Reload page to apply theme changes
        setTimeout(() => window.location.reload(), 1000);
      } catch (error) {
        setButtonLoading(submitBtn, false);
        showToast(error.message || 'Failed to save preferences', 'error');
      }
    });
  }
});

async function loadProfile() {
  try {
    const data = await apiCall('/user/profile');
    const user = data.user;
    
    // Update form fields
    if (user.firstName) document.getElementById('firstName').value = user.firstName;
    if (user.lastName) document.getElementById('lastName').value = user.lastName;
    
    // Update account info display
    const accountInfo = document.getElementById('account-info');
    if (accountInfo) {
      accountInfo.innerHTML = `
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Email:</span>
            <span class="text-sm font-medium">${user.email || 'N/A'}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Username:</span>
            <span class="text-sm font-medium">${user.username || 'N/A'}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Member since:</span>
            <span class="text-sm font-medium">${user.createdAt ? formatDate(user.createdAt) : 'N/A'}</span>
          </div>
        </div>
      `;
    }
    
    // Update preferences
    if (user.preferences) {
      if (user.preferences.theme) document.getElementById('theme').value = user.preferences.theme;
      if (user.preferences.highContrast !== undefined) document.getElementById('highContrast').checked = user.preferences.highContrast;
      if (user.preferences.textToSpeech !== undefined) document.getElementById('textToSpeech').checked = user.preferences.textToSpeech;
      if (user.preferences.notifications !== undefined) document.getElementById('notifications').checked = user.preferences.notifications;
    }
  } catch (error) {
    console.error('Error loading profile:', error);
    showToast('Failed to load profile information', 'error');
  }
}

