import { apiCall, requireAuth, showToast, formatDate, setButtonLoading } from './utils.js';
import { initSocket, getSocket } from './socket-client.js';

// Check authentication
const isAuthenticated = requireAuth();
if (!isAuthenticated) {
  console.log('Not authenticated - login to save your mood entries');
}

let moodChart = null;
let selectedEmotion = '';
let selectedMoodLevel = 5;

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize Socket.IO if authenticated
  if (isAuthenticated) {
    initSocket();
    
    // Listen for real-time mood updates
    window.addEventListener('mood:created', (e) => {
      showToast('Mood saved! Dashboard updated in real-time.', 'success');
      loadMoodChart();
    });
    
    window.addEventListener('mood:updated', (e) => {
      showToast('Mood updated!', 'success');
      loadMoodChart();
    });
    
    window.addEventListener('mood:deleted', (e) => {
      showToast('Mood deleted!', 'success');
      loadMoodChart();
    });
  }
  
  // Mood emotion buttons
  const moodButtons = document.querySelectorAll('.mood-emoji-btn');
  moodButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      moodButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      selectedEmotion = btn.dataset.mood;
      selectedMoodLevel = parseInt(btn.dataset.level) || 5;
      document.getElementById('selected-emotion').value = selectedEmotion;
      document.getElementById('selected-mood-level').value = selectedMoodLevel;
      document.getElementById('intensity').value = selectedMoodLevel;
      document.getElementById('intensity-value').textContent = selectedMoodLevel;
    });
  });
  
  // Intensity slider
  const intensitySlider = document.getElementById('intensity');
  const intensityValue = document.getElementById('intensity-value');
  if (intensitySlider && intensityValue) {
    intensitySlider.addEventListener('input', (e) => {
      selectedMoodLevel = parseInt(e.target.value);
      intensityValue.textContent = selectedMoodLevel;
    });
  }
  
  // Note character counter
  const moodNote = document.getElementById('mood-note');
  const noteCharCount = document.getElementById('note-char-count');
  if (moodNote && noteCharCount) {
    setupCharCounter(moodNote, noteCharCount, 500);
  }
  
  // Form submission
  const moodForm = document.getElementById('mood-form');
  if (moodForm) {
    moodForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = moodForm.querySelector('button[type="submit"]');
      if (submitBtn && submitBtn.disabled) return;
      
      if (!selectedEmotion) {
        showToast('Please select a mood', 'error');
        return;
      }
      
      setButtonLoading(submitBtn, true, 'Saving...');
      
      try {
        const formData = {
          moodLevel: selectedMoodLevel,
          emotion: selectedEmotion,
          note: moodNote.value.trim()
        };
        
        await apiCall('/mood', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
        
        showToast('Mood saved successfully!', 'success');
        moodForm.reset();
        selectedEmotion = '';
        selectedMoodLevel = 5;
        moodButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        document.getElementById('intensity').value = 5;
        document.getElementById('intensity-value').textContent = '5';
        
        // Chart will update via Socket.IO event
        await loadMoodChart();
      } catch (error) {
        showToast(error.message || 'Failed to save mood', 'error');
      } finally {
        setButtonLoading(submitBtn, false);
      }
    });
  }
  
  // Load mood history chart
  await loadMoodChart();
});

// Character counter helper
function setupCharCounter(textarea, counterElement, maxLength) {
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
}

async function loadMoodChart() {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    const data = await apiCall(`/mood?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&limit=30`);
    
    const ctx = document.getElementById('mood-trend-chart');
    if (!ctx) return;
    
    if (!data.moods || data.moods.length === 0) {
      ctx.parentElement.innerHTML = `
        <div class="text-center py-12">
          <div class="text-6xl mb-4">📊</div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">No mood data yet</h3>
          <p class="text-gray-600 mb-6">Start tracking your mood to see patterns and insights over time.</p>
          <a href="#mood-entry" class="btn-primary inline-block">Track Your First Mood</a>
        </div>
      `;
      return;
    }
    
    // Destroy existing chart if it exists
    if (moodChart) {
      moodChart.destroy();
    }
    
    const labels = data.moods.map(m => formatDate(m.date));
    const moodLevels = data.moods.map(m => m.moodLevel);
    
    moodChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels.reverse(),
        datasets: [{
          label: 'Mood Level',
          data: moodLevels.reverse(),
          borderColor: 'rgb(139, 92, 246)',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          y: {
            beginAtZero: false,
            min: 1,
            max: 10
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  } catch (error) {
    console.error('Error loading mood chart:', error);
    if (ctx && ctx.parentElement) {
      ctx.parentElement.innerHTML = `
        <div class="text-center py-12">
          <div class="text-6xl mb-4">😕</div>
          <h3 class="text-xl font-semibold text-red-600 mb-2">Unable to load mood history</h3>
          <p class="text-gray-600 mb-6">${error.message || 'Please check your connection and try again.'}</p>
          <button onclick="location.reload()" class="btn-primary">Retry</button>
        </div>
      `;
    }
  }
}

// Expose update function for Socket.IO
window.updateMoodChart = loadMoodChart;
