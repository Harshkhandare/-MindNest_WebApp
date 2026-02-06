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
        const theme = document.getElementById('theme').value;
        const highContrast = document.getElementById('highContrast').checked;
        const textToSpeech = document.getElementById('textToSpeech').checked;
        const notifications = document.getElementById('notifications').checked;
        
        await apiCall('/user/preferences', {
          method: 'PUT',
          body: JSON.stringify({
            theme,
            highContrast,
            textToSpeech,
            notifications
          })
        });
        
        // Apply theme immediately without reload
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Apply high contrast immediately
        if (highContrast) {
          document.body.classList.add('high-contrast');
        } else {
          document.body.classList.remove('high-contrast');
        }
        localStorage.setItem('highContrast', highContrast);
        
        // Store text-to-speech preference
        localStorage.setItem('textToSpeech', textToSpeech);
        
        showToast('Preferences saved! ✨', 'success');
        setButtonLoading(submitBtn, false);
      } catch (error) {
        setButtonLoading(submitBtn, false);
        showToast(error.message || 'Failed to save preferences', 'error');
      }
    });
  }
});

async function loadProfile() {
  const accountInfo = document.getElementById('account-info');
  
  try {
    const data = await apiCall('/user/profile');
    const user = data.user;
    
    // Update form fields
    if (user.firstName) {
      const firstNameField = document.getElementById('firstName');
      if (firstNameField) firstNameField.value = user.firstName;
    }
    if (user.lastName) {
      const lastNameField = document.getElementById('lastName');
      if (lastNameField) lastNameField.value = user.lastName;
    }
    
    // Update account info display - Clear loading state
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
    
    // Update preferences and apply them immediately
    if (user.theme || user.highContrast !== undefined || user.textToSpeech !== undefined || user.notifications !== undefined) {
      // Apply theme from database
      if (user.theme) {
        const themeSelect = document.getElementById('theme');
        if (themeSelect) themeSelect.value = user.theme;
        // Apply theme immediately
        document.documentElement.setAttribute('data-theme', user.theme);
        localStorage.setItem('theme', user.theme);
      }
      
      // Apply high contrast from database
      if (user.highContrast !== undefined) {
        const highContrast = document.getElementById('highContrast');
        if (highContrast) highContrast.checked = user.highContrast;
        // Apply high contrast immediately
        if (user.highContrast) {
          document.body.classList.add('high-contrast');
        } else {
          document.body.classList.remove('high-contrast');
        }
        localStorage.setItem('highContrast', user.highContrast);
      }
      
      // Set text-to-speech preference
      if (user.textToSpeech !== undefined) {
        const textToSpeech = document.getElementById('textToSpeech');
        if (textToSpeech) textToSpeech.checked = user.textToSpeech;
        localStorage.setItem('textToSpeech', user.textToSpeech);
      }
      
      // Set notifications preference
      if (user.notifications !== undefined) {
        const notifications = document.getElementById('notifications');
        if (notifications) notifications.checked = user.notifications;
      }
    } else if (user.preferences) {
      // Fallback to preferences object (if API returns nested structure)
      const themeSelect = document.getElementById('theme');
      if (themeSelect && user.preferences.theme) {
        themeSelect.value = user.preferences.theme;
        document.documentElement.setAttribute('data-theme', user.preferences.theme);
        localStorage.setItem('theme', user.preferences.theme);
      }
      
      const highContrast = document.getElementById('highContrast');
      if (highContrast && user.preferences.highContrast !== undefined) {
        highContrast.checked = user.preferences.highContrast;
        if (user.preferences.highContrast) {
          document.body.classList.add('high-contrast');
        } else {
          document.body.classList.remove('high-contrast');
        }
        localStorage.setItem('highContrast', user.preferences.highContrast);
      }
      
      const textToSpeech = document.getElementById('textToSpeech');
      if (textToSpeech && user.preferences.textToSpeech !== undefined) {
        textToSpeech.checked = user.preferences.textToSpeech;
        localStorage.setItem('textToSpeech', user.preferences.textToSpeech);
      }
      
      const notifications = document.getElementById('notifications');
      if (notifications && user.preferences.notifications !== undefined) {
        notifications.checked = user.preferences.notifications;
      }
    }
  } catch (error) {
    console.error('Error loading profile:', error);
    
    // Clear loading state and show error message
    if (accountInfo) {
      accountInfo.innerHTML = `
        <div class="text-center py-4">
          <div class="text-5xl mb-3">😕</div>
          <p class="text-sm text-red-600 mb-2">Failed to load account information</p>
          <p class="text-xs text-gray-500">${error.message || 'Please try refreshing the page'}</p>
        </div>
      `;
    }
    
    showToast('Failed to load profile information', 'error');
  }
}

