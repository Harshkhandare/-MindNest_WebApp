import { apiCall, requireAuth, showToast, setButtonLoading, showSkeleton, showConfirmation } from './utils.js';
import { initSocket, getSocket } from './socket-client.js';

// Check authentication
const isAuthenticated = requireAuth();
if (!isAuthenticated) {
  // Redirect handled in utils
}

// Request notification permission
if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission();
}

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize Socket.IO if authenticated
  if (isAuthenticated) {
    initSocket();
    
    // Listen for reminder notifications and updates
    const socket = getSocket();
    if (socket) {
      socket.on('reminder:triggered', (data) => {
        showToast(`Reminder: ${data.title}`, 'info');
        
        // Show browser notification if permission granted
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(data.title, {
            body: data.description || `Time for your ${data.type}`,
            icon: '/favicon.ico',
            tag: `reminder-${data.id}`
          });
        }
        
        // Reload reminders list
        loadReminders();
      });
      
      socket.on('reminder:created', (data) => {
        showToast('Reminder created!', 'success');
        loadReminders();
      });
      
      socket.on('reminder:updated', (data) => {
        showToast('Reminder updated!', 'success');
        loadReminders();
      });
      
      socket.on('reminder:deleted', (data) => {
        showToast('Reminder deleted!', 'success');
        loadReminders();
      });
    }
  }
  // Form submission
  const reminderForm = document.getElementById('reminder-form');
  if (reminderForm) {
    reminderForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = reminderForm.querySelector('button[type="submit"]');
      if (submitBtn && submitBtn.disabled) return;
      
      const formData = {
        type: document.getElementById('reminder-type').value,
        title: document.getElementById('reminder-title').value.trim(),
        description: document.getElementById('reminder-description').value.trim(),
        time: document.getElementById('reminder-time').value,
        days: Array.from(document.querySelectorAll('input[name="days"]:checked')).map(cb => parseInt(cb.value))
      };
      
      if (!formData.title) {
        showToast('Please enter a reminder title', 'error');
        return;
      }
      
      if (formData.days.length === 0) {
        showToast('Please select at least one day', 'error');
        return;
      }
      
      setButtonLoading(submitBtn, true, 'Creating...');
      
      try {
        await apiCall('/reminders', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
        
        showToast('Reminder created successfully!', 'success');
        reminderForm.reset();
        await loadReminders();
      } catch (error) {
        showToast(error.message || 'Failed to create reminder', 'error');
      } finally {
        setButtonLoading(submitBtn, false);
      }
    });
  }
  
  // Load reminders
  await loadReminders();
  
  // Check for due reminders
  checkDueReminders();
  setInterval(checkDueReminders, 60000); // Check every minute
});

async function loadReminders() {
  const container = document.getElementById('reminders-container');
  if (!container) return;
  
  // Show loading state
  showSkeleton(container, 'card', 3);
  
  try {
    const data = await apiCall('/reminders?isActive=true');
    
    if (!data.reminders || data.reminders.length === 0) {
      container.innerHTML = `
        <div class="text-center py-12">
          <div class="text-6xl mb-4">⏰</div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">No active reminders</h3>
          <p class="text-gray-600 mb-6">Create a reminder above to help you stay on track with your wellness routine.</p>
        </div>
      `;
      return;
    }
    
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    container.innerHTML = data.reminders.map(reminder => {
      const reminderId = reminder.id || reminder._id;
      const daysText = reminder.days.map(d => dayNames[d]).join(', ');
      const typeIcons = {
        medication: '💊',
        therapy: '🛋️',
        exercise: '🏃',
        custom: '📌'
      };
      
      return `
        <article class="card reminder-card" role="listitem" data-id="${reminderId}">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-2">
                <span class="text-2xl">${typeIcons[reminder.type] || '📌'}</span>
                <h3 class="font-semibold text-lg">${reminder.title}</h3>
              </div>
              ${reminder.description ? `<p class="text-gray-600 text-sm mb-2">${reminder.description}</p>` : ''}
              <div class="text-sm text-gray-500 space-y-1">
                <p>⏰ Time: ${reminder.time}</p>
                <p>📅 Days: ${daysText}</p>
              </div>
            </div>
            <div class="flex flex-col space-y-2 ml-4">
              <button class="btn-secondary toggle-reminder" data-id="${reminderId}" data-active="${reminder.isActive}">
                ${reminder.isActive ? '⏸️ Pause' : '▶️ Resume'}
              </button>
              <button class="text-red-600 hover:text-red-700 delete-reminder" data-id="${reminderId}">
                🗑️ Delete
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');
    
    // Attach event listeners
    attachReminderListeners();
  } catch (error) {
    console.error('Error loading reminders:', error);
    const container = document.getElementById('reminders-container');
    if (container) {
      container.innerHTML = `
        <div class="text-center py-12">
          <div class="text-6xl mb-4">😕</div>
          <h3 class="text-xl font-semibold text-red-600 mb-2">Unable to load reminders</h3>
          <p class="text-gray-600 mb-6">${error.message || 'Please check your connection and try again.'}</p>
          <button onclick="location.reload()" class="btn-primary">Retry</button>
        </div>
      `;
    }
    showToast('Failed to load reminders. Please try again.', 'error');
  }
}

function attachReminderListeners() {
  // Toggle reminder
  document.querySelectorAll('.toggle-reminder').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      const isActive = btn.dataset.active === 'true';
      
      if (btn.disabled) return;
      
      setButtonLoading(btn, true, 'Updating...');
      
      try {
        await apiCall(`/reminders/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ isActive: !isActive })
        });
        
        showToast(isActive ? 'Reminder paused' : 'Reminder resumed', 'success');
        await loadReminders();
      } catch (error) {
        showToast(error.message || 'Failed to update reminder', 'error');
        setButtonLoading(btn, false);
        btn.textContent = isActive ? '⏸️ Pause' : '▶️ Resume';
      }
    });
  });
  
  // Delete reminder
  document.querySelectorAll('.delete-reminder').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      if (btn.disabled) return;
      
      showConfirmation({
        title: 'Delete Reminder',
        message: 'Are you sure you want to delete this reminder? This action cannot be undone.',
        type: 'danger',
        confirmText: 'Yes, Delete',
        cancelText: 'Cancel',
        onConfirm: async () => {
          setButtonLoading(btn, true, 'Deleting...');
          
          try {
            await apiCall(`/reminders/${id}`, { method: 'DELETE' });
            showToast('Reminder deleted', 'success');
            await loadReminders();
          } catch (error) {
            setButtonLoading(btn, false);
            showToast(error.message || 'Failed to delete reminder', 'error');
          }
        }
      });
    });
  });
}

async function checkDueReminders() {
  try {
    const data = await apiCall('/reminders?isActive=true');
    if (!data.reminders) return;
    
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const currentDay = now.getDay();
    
    data.reminders.forEach(reminder => {
      if (reminder.time === currentTime && reminder.days.includes(currentDay)) {
        // Check if already triggered today
        const lastTriggered = reminder.lastTriggered ? new Date(reminder.lastTriggered) : null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (!lastTriggered || lastTriggered < today) {
          showNotification(reminder);
          // Update last triggered (would need API endpoint for this)
        }
      }
    });
  } catch (error) {
    console.error('Error checking reminders:', error);
  }
}

function showNotification(reminder) {
  if ('Notification' in window && Notification.permission === 'granted') {
        const reminderId = reminder.id || reminder._id;
        new Notification(`MindNest Reminder: ${reminder.title}`, {
          body: reminder.description || `Time for your ${reminder.type}`,
          icon: '/assets/icons/icon-192x192.png',
          tag: reminderId
        });
  }
  
  showToast(`Reminder: ${reminder.title}`, 'info');
}

