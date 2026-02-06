import { apiCall, getCurrentUser, requireAuth, logout, formatDate, showToast } from './utils.js';
import { initSocket, getSocket } from './socket-client.js';

// Check authentication
const isAuthenticated = requireAuth();
if (!isAuthenticated) {
  console.log('Not authenticated - login to see your personalized dashboard');
}

let moodChart = null;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', async () => {
  const user = getCurrentUser();
  
  // Set user name
  const userNameElement = document.getElementById('user-name');
  if (userNameElement && user) {
    userNameElement.textContent = user.firstName || user.username || 'User';
  }
  
  // Set time of day
  const timeOfDayElement = document.getElementById('time-of-day');
  if (timeOfDayElement) {
    const hour = new Date().getHours();
    if (hour < 12) timeOfDayElement.textContent = 'morning';
    else if (hour < 17) timeOfDayElement.textContent = 'afternoon';
    else timeOfDayElement.textContent = 'evening';
  }
  
  // Initialize Socket.IO
  if (isAuthenticated) {
    initSocket();
    
    // Listen for real-time mood updates
    window.addEventListener('mood:created', (e) => {
      updateMoodChart(e.detail.stats);
      showToast('Mood updated in real-time!', 'success');
    });
    
    window.addEventListener('mood:updated', (e) => {
      updateMoodChart(e.detail.stats);
    });
    
    window.addEventListener('mood:deleted', (e) => {
      updateMoodChart(e.detail.stats);
    });
    
    // Listen for journal updates
    window.addEventListener('journal:created', () => {
      loadRecentJournals();
    });
    
    window.addEventListener('journal:updated', () => {
      loadRecentJournals();
    });
    
    window.addEventListener('journal:deleted', () => {
      loadRecentJournals();
    });
  }
  
  // Load mood chart
  await loadMoodChart();
  
  // Load motivational quote
  loadMotivationalQuote();
  
  // Load recent journals
  await loadRecentJournals();
  
  // Logout button with confirmation
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logout(true); // Show confirmation
    });
  }
});

// Load mood chart
async function loadMoodChart() {
  const chartContainer = document.querySelector('.chart-container');
  if (!chartContainer) return;
  
  // Show loading state BEFORE API call
  chartContainer.innerHTML = `
    <div class="text-center py-8">
      <div class="loading-spinner mx-auto mb-4"></div>
      <p class="text-gray-500">Loading mood data...</p>
    </div>
  `;
  
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    
    const data = await apiCall(`/mood?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
    
    // Check if we have mood data
    if (!data.moods || data.moods.length === 0) {
      chartContainer.innerHTML = `
        <div class="text-center py-8">
          <div class="text-5xl mb-3">📊</div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">No mood data this week</h3>
          <p class="text-gray-600 text-sm mb-4">Start tracking your mood to see your weekly patterns.</p>
          <a href="mood.html" class="btn-primary btn-sm inline-block">Track Mood</a>
        </div>
      `;
      return;
    }
    
    // Restore canvas element for chart
    chartContainer.innerHTML = '<canvas id="mood-chart" role="img" aria-label="Weekly mood trend chart"></canvas>';
    const ctx = document.getElementById('mood-chart');
    if (!ctx) return;
    
    const labels = data.moods.map(m => formatDate(m.date));
    const moodLevels = data.moods.map(m => m.moodLevel);
    
    // Destroy existing chart if it exists
    if (moodChart) {
      moodChart.destroy();
    }
    
    // Create new chart
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
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          y: {
            beginAtZero: false,
            min: 1,
            max: 10,
            ticks: {
              stepSize: 1
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleFont: {
              size: 14
            },
            bodyFont: {
              size: 13
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('Error loading mood chart:', error);
    // Show error state
    chartContainer.innerHTML = `
      <div class="text-center py-8">
        <div class="text-5xl mb-3">😕</div>
        <h3 class="text-lg font-semibold text-red-600 mb-2">Unable to load mood data</h3>
        <p class="text-gray-600 text-sm mb-4">${error.message || 'Please try again later.'}</p>
        <button onclick="location.reload()" class="btn-primary btn-sm">Retry</button>
      </div>
    `;
  }
}

// Update mood chart with new data
window.updateMoodChart = async function(stats) {
  // Reload chart with fresh data
  await loadMoodChart();
};

// Load motivational quote
function loadMotivationalQuote() {
  const quotes = [
    "Recovery is not a destination, but a journey. Every step forward, no matter how small, is progress.",
    "You are stronger than you know, braver than you believe, and more loved than you can imagine.",
    "It's okay to not be okay. What matters is that you're taking steps to feel better.",
    "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.",
    "Healing takes time, and asking for help is a courageous step.",
    "You don't have to be positive all the time. It's perfectly okay to feel sad, angry, or frustrated.",
    "Small progress is still progress. Celebrate every step forward, no matter how small."
  ];
  
  const quoteElement = document.getElementById('motivational-quote');
  if (quoteElement) {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteElement.textContent = randomQuote;
  }
}

// Load recent journals
async function loadRecentJournals() {
  try {
    const data = await apiCall('/journal?limit=3');
    const container = document.getElementById('recent-journals');
    
    if (!container) return;
    
    if (!data.journals || data.journals.length === 0) {
      container.innerHTML = `
        <div class="text-center py-8">
          <div class="text-5xl mb-3">📝</div>
          <p class="text-gray-600 mb-4">No journal entries yet.</p>
          <a href="journal.html" class="btn-primary btn-sm inline-block">Start Writing</a>
        </div>
      `;
      return;
    }
    
    container.innerHTML = data.journals.map(journal => `
      <article class="card">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="font-semibold text-lg mb-2">${journal.title || 'Untitled Entry'}</h3>
            <p class="text-gray-600 text-sm mb-2 line-clamp-2">${journal.content.substring(0, 150)}...</p>
            <time class="text-xs text-gray-500">${formatDate(journal.createdAt)}</time>
          </div>
          <a href="journal.html" class="text-purple-600 hover:text-purple-700 ml-4">View →</a>
        </div>
      </article>
    `).join('');
  } catch (error) {
    console.error('Error loading recent journals:', error);
    const container = document.getElementById('recent-journals');
    if (container) {
      container.innerHTML = `
        <div class="text-center py-8">
          <div class="text-5xl mb-3">😕</div>
          <p class="text-gray-600">Unable to load recent journals. ${error.message || 'Please try again later.'}</p>
        </div>
      `;
    }
  }
}

// Expose refresh function for Socket.IO
window.refreshJournalList = loadRecentJournals;
