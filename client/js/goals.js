import { apiCall, requireAuth, showToast, formatDate, showSkeleton, setButtonLoading, showConfirmation } from './utils.js';
import { initSocket, getSocket } from './socket-client.js';

// Check authentication (allow access but show message if not logged in)
const isAuthenticated = requireAuth();
if (!isAuthenticated) {
  // Show message but allow access to view the page
  console.log('Not authenticated - login to save your goals');
}

let currentEditingId = null;

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize Socket.IO if authenticated
  if (isAuthenticated) {
    initSocket();
    
    // Listen for real-time goal updates
    const socket = getSocket();
    if (socket) {
      socket.on('goal:changed', (data) => {
        showToast('Goal updated!', 'success');
        loadGoals(); // Reload goals list
      });
    }
  }
  // Form submission
  const goalForm = document.getElementById('goal-form');
  if (goalForm) {
    goalForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = goalForm.querySelector('button[type="submit"]');
      if (submitBtn && submitBtn.disabled) return;
      
      const formData = {
        title: document.getElementById('goal-title').value.trim(),
        description: document.getElementById('goal-description').value.trim(),
        type: document.getElementById('goal-type').value,
        targetDate: document.getElementById('target-date').value || null
      };
      
      if (!formData.title) {
        showToast('Please enter a goal title', 'error');
        return;
      }
      
      setButtonLoading(submitBtn, true, currentEditingId ? 'Updating...' : 'Creating...');
      
      try {
        if (currentEditingId) {
          await apiCall(`/goals/${currentEditingId}`, {
            method: 'PUT',
            body: JSON.stringify(formData)
          });
          showToast('Goal updated successfully!', 'success');
          currentEditingId = null;
          // Reset button text
          submitBtn.textContent = 'Create Goal';
        } else {
          await apiCall('/goals', {
            method: 'POST',
            body: JSON.stringify(formData)
          });
          showToast('Goal created successfully!', 'success');
        }
        
        goalForm.reset();
        // Clear editing state
        const submitButton = document.getElementById('goal-form').querySelector('button[type="submit"]');
        if (submitButton) {
          submitButton.textContent = 'Create Goal';
        }
        currentEditingId = null;
        await loadGoals();
      } catch (error) {
        showToast(error.message || 'Failed to save goal', 'error');
      } finally {
        setButtonLoading(submitBtn, false);
      }
    });
  }
  
  // Load goals on page load
  await loadGoals();
});

async function loadGoals() {
  const container = document.getElementById('goals-container');
  
  if (!container) {
    console.error('Goals container not found');
    return;
  }
  
  // Show loading state
  showSkeleton(container, 'card', 3);
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    container.innerHTML = `
      <div class="text-center py-12">
        <div class="text-6xl mb-4">🔒</div>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">Login to view your goals</h3>
        <p class="text-gray-600 mb-6">Create an account or login to start setting and tracking your goals.</p>
        <a href="login.html" class="btn-primary inline-block">Login</a>
      </div>
    `;
    return;
  }
  
  try {
    const data = await apiCall('/goals');
    
    if (!data) {
      container.innerHTML = '<p class="text-red-500 text-center py-8">Error: No data received from server.</p>';
      return;
    }
    
    if (!data.goals || data.goals.length === 0) {
      container.innerHTML = `
        <div class="text-center py-12">
          <div class="text-6xl mb-4">🎯</div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">No goals yet</h3>
          <p class="text-gray-600 mb-6">Set your first goal above to start tracking your progress and achievements.</p>
        </div>
      `;
      return;
    }
    
    // Separate by status
    const activeGoals = data.goals.filter(g => g.status !== 'completed' && g.status !== 'cancelled');
    const completedGoals = data.goals.filter(g => g.status === 'completed');
    
    let html = '';
    
    if (activeGoals.length > 0) {
      html += '<h3 class="text-lg font-semibold mb-4 text-gray-800">Active Goals</h3>';
      html += activeGoals.map(goal => createGoalCard(goal)).join('');
    }
    
    if (completedGoals.length > 0) {
      html += '<h3 class="text-lg font-semibold mb-4 mt-8 text-gray-800">Completed Goals</h3>';
      html += completedGoals.map(goal => createGoalCard(goal)).join('');
    }
    
    if (html === '') {
      container.innerHTML = '<p class="text-gray-500 text-center py-8">No goals to display.</p>';
      return;
    }
    
    container.innerHTML = html;
    
    // Attach event listeners
    attachGoalListeners();
  } catch (error) {
    console.error('Error loading goals:', error);
    const errorMessage = error.message || 'Unable to load goals';
    
    if (errorMessage.includes('Authentication') || errorMessage.includes('401')) {
      container.innerHTML = `
        <div class="text-center py-12">
          <div class="text-6xl mb-4">🔒</div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">Authentication required</h3>
          <p class="text-gray-600 mb-6">Please login to view your goals.</p>
          <a href="login.html" class="btn-primary inline-block">Login</a>
        </div>
      `;
    } else if (errorMessage.includes('Database not connected')) {
      container.innerHTML = `
        <div class="text-center py-12">
          <div class="text-6xl mb-4">⚠️</div>
          <h3 class="text-xl font-semibold text-red-600 mb-2">Connection error</h3>
          <p class="text-gray-600 mb-6">Unable to connect to the database. Please try again later.</p>
          <button onclick="location.reload()" class="btn-primary">Retry</button>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="text-center py-12">
          <div class="text-6xl mb-4">😕</div>
          <h3 class="text-xl font-semibold text-red-600 mb-2">Unable to load goals</h3>
          <p class="text-gray-600 mb-6">${errorMessage}</p>
          <button onclick="location.reload()" class="btn-primary">Retry</button>
        </div>
      `;
    }
  }
}

function createGoalCard(goal) {
  const progress = goal.progress || 0;
  const goalId = goal.id || goal._id;
  const statusColors = {
    'pending': 'bg-gray-200',
    'in-progress': 'bg-blue-500',
    'completed': 'bg-green-500',
    'cancelled': 'bg-red-500'
  };
  
  return `
    <article class="card goal-card" role="listitem" data-id="${goalId}">
      <header class="flex items-start justify-between mb-4">
        <div class="flex-1">
          <h3 class="font-semibold text-lg mb-1">${goal.title}</h3>
          ${goal.description ? `<p class="text-gray-600 text-sm">${goal.description}</p>` : ''}
        </div>
        <span class="px-3 py-1 text-xs font-semibold rounded-full ${statusColors[goal.status]} text-white ml-4">
          ${goal.status.replace('-', ' ')}
        </span>
      </header>
      
      <div class="goal-progress mb-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium">Progress</span>
          <span class="text-sm text-gray-600">${progress}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-3">
          <div 
            class="bg-gradient-to-r from-purple-500 to-teal-500 h-3 rounded-full transition-all duration-300"
            style="width: ${progress}%"
            role="progressbar"
            aria-valuenow="${progress}"
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
      </div>
      
      <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span>Type: ${goal.type}</span>
        ${goal.targetDate ? `<span>Target: ${formatDate(goal.targetDate)}</span>` : ''}
      </div>
      
      <div class="goal-actions flex flex-wrap gap-2">
        <button class="btn-update-progress btn-secondary flex-1 min-w-[140px]" data-id="${goalId}">
          📊 Update Progress
        </button>
        ${goal.status !== 'completed' && goal.status !== 'cancelled' ? `
          <button class="btn-complete-goal btn-primary flex-1 min-w-[120px]" data-id="${goalId}">
            ✓ Complete
          </button>
        ` : ''}
        ${goal.status === 'pending' ? `
          <button class="btn-start-goal btn-secondary flex-1 min-w-[120px]" data-id="${goalId}">
            ▶️ Start
          </button>
        ` : ''}
        <button class="btn-edit-goal btn-secondary flex-1 min-w-[100px]" data-id="${goalId}">
          ✏️ Edit
        </button>
        <button class="btn-delete-goal text-red-600 hover:text-red-700 px-4 py-2 border border-red-300 rounded hover:bg-red-50 transition-colors" data-id="${goalId}" aria-label="Delete goal">
          🗑️ Delete
        </button>
      </div>
    </article>
  `;
}

function attachGoalListeners() {
  // Update progress
  document.querySelectorAll('.btn-update-progress').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      if (btn.disabled) return;
      
      // Get current goal to show current progress
      try {
        const goalData = await apiCall(`/goals/${id}`);
        const currentProgress = goalData.goal.progress || 0;
        
        // Show progress update modal
        showProgressUpdateModal(id, currentProgress);
      } catch (error) {
        showToast('Failed to load goal details', 'error');
      }
    });
  });
  
  // Complete goal
  document.querySelectorAll('.btn-complete-goal').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      if (btn.disabled) return;
      
      btn.disabled = true;
      btn.textContent = 'Completing...';
      
      try {
        await apiCall(`/goals/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ status: 'completed', progress: 100 })
        });
        showToast('Goal completed! 🎉', 'success');
        await loadGoals();
      } catch (error) {
        setButtonLoading(btn, false);
        showToast(error.message || 'Failed to complete goal', 'error');
      }
    });
  });
  
  // Start goal (change status from pending to in-progress)
  document.querySelectorAll('.btn-start-goal').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      if (btn.disabled) return;
      
      setButtonLoading(btn, true, 'Starting...');
      
      try {
        await apiCall(`/goals/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ status: 'in-progress' })
        });
        showToast('Goal started!', 'success');
        await loadGoals();
      } catch (error) {
        showToast(error.message || 'Failed to start goal', 'error');
        btn.disabled = false;
        btn.textContent = '▶️ Start';
      }
    });
  });
  
  // Edit goal
  document.querySelectorAll('.btn-edit-goal').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      await editGoal(id);
    });
  });
  
  // Delete goal
  document.querySelectorAll('.btn-delete-goal').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      if (btn.disabled) return;
      
      showConfirmation({
        title: 'Delete Goal',
        message: 'Are you sure you want to delete this goal? This action cannot be undone.',
        type: 'danger',
        confirmText: 'Yes, Delete',
        cancelText: 'Cancel',
        onConfirm: async () => {
          setButtonLoading(btn, true, 'Deleting...');
          
          try {
            await apiCall(`/goals/${id}`, { method: 'DELETE' });
            showToast('Goal deleted', 'success');
            await loadGoals();
          } catch (error) {
            setButtonLoading(btn, false);
            showToast(error.message || 'Failed to delete goal', 'error');
          }
        }
      });
    });
  });
}

async function editGoal(id) {
  try {
    const data = await apiCall(`/goals/${id}`);
    const goal = data.goal;
    
    document.getElementById('goal-title').value = goal.title;
    document.getElementById('goal-description').value = goal.description || '';
    document.getElementById('goal-type').value = goal.type;
    if (goal.targetDate) {
      document.getElementById('target-date').value = new Date(goal.targetDate).toISOString().split('T')[0];
    }
    currentEditingId = id;
    
    // Update button text
    const submitBtn = document.getElementById('goal-form').querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.textContent = 'Update Goal';
    }
    
    document.getElementById('goal-form').scrollIntoView({ behavior: 'smooth' });
    showToast('Goal loaded for editing', 'info');
  } catch (error) {
    showToast(error.message || 'Failed to load goal', 'error');
  }
}

function showProgressUpdateModal(goalId, currentProgress) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  modal.innerHTML = `
    <div class="bg-white rounded-lg p-8 max-w-md mx-4">
      <h2 class="text-2xl font-bold mb-4">Update Progress</h2>
      <div class="mb-6">
        <label class="block text-sm font-medium mb-2">Progress: <span id="progress-value">${currentProgress}</span>%</label>
        <input 
          type="range" 
          id="progress-slider" 
          min="0" 
          max="100" 
          value="${currentProgress}" 
          class="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        >
        <div class="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium mb-2">Status</label>
        <select id="status-select" class="input-field w-full">
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div class="flex space-x-4">
        <button class="btn-primary flex-1" id="save-progress-btn">Save Changes</button>
        <button class="btn-secondary flex-1" id="cancel-progress-btn">Cancel</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Update progress value display
  const slider = modal.querySelector('#progress-slider');
  const progressValue = modal.querySelector('#progress-value');
  slider.addEventListener('input', (e) => {
    progressValue.textContent = e.target.value;
  });
  
  // Load current status
  apiCall(`/goals/${goalId}`).then(data => {
    const statusSelect = modal.querySelector('#status-select');
    if (statusSelect && data.goal.status) {
      statusSelect.value = data.goal.status;
    }
  }).catch(() => {});
  
  // Save button
  modal.querySelector('#save-progress-btn').addEventListener('click', async () => {
    const progress = parseInt(slider.value);
    const status = modal.querySelector('#status-select').value;
    const saveBtn = modal.querySelector('#save-progress-btn');
    
    setButtonLoading(saveBtn, true, 'Saving...');
    
    try {
      await apiCall(`/goals/${goalId}`, {
        method: 'PUT',
        body: JSON.stringify({ progress, status })
      });
      showToast('Progress updated!', 'success');
      modal.remove();
      await loadGoals();
    } catch (error) {
      setButtonLoading(saveBtn, false);
      showToast(error.message || 'Failed to update progress', 'error');
    }
  });
  
  // Cancel button
  modal.querySelector('#cancel-progress-btn').addEventListener('click', () => {
    modal.remove();
  });
  
  // Close on background click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

// Add CSS for progress slider
const goalStyle = document.createElement('style');
goalStyle.textContent = `
  #progress-slider {
    -webkit-appearance: none;
    appearance: none;
    height: 8px;
    background: #e5e7eb;
    border-radius: 5px;
    outline: none;
  }
  
  #progress-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    background: #8B5CF6;
    border-radius: 50%;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  #progress-slider::-webkit-slider-thumb:hover {
    background: #7C3AED;
  }
  
  #progress-slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: #8B5CF6;
    border-radius: 50%;
    cursor: pointer;
    border: none;
    transition: background 0.2s;
  }
  
  #progress-slider::-moz-range-thumb:hover {
    background: #7C3AED;
  }
  
  .goal-actions button {
    transition: all 0.2s;
  }
  
  .goal-actions button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
document.head.appendChild(goalStyle);

