import { apiCall, requireAuth, showToast } from './utils.js';

// Check authentication
if (!requireAuth()) {
  window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadInsights();
});

async function loadInsights() {
  try {
    const data = await apiCall('/insights/mood-insights?days=30');
    
    // Display insights
    const insightsContainer = document.getElementById('insights-container');
    if (insightsContainer) {
      if (data.insights && data.insights.length > 0) {
        insightsContainer.innerHTML = data.insights.map(insight => `
          <div class="p-3 rounded-lg ${insight.type === 'positive' ? 'bg-green-50 border-l-4 border-green-500' : insight.type === 'warning' ? 'bg-yellow-50 border-l-4 border-yellow-500' : 'bg-blue-50 border-l-4 border-blue-500'}">
            <div class="flex items-start space-x-2">
              <span class="text-2xl">${insight.icon}</span>
              <p class="text-gray-700">${insight.message}</p>
            </div>
          </div>
        `).join('');
      } else {
        insightsContainer.innerHTML = '<p class="text-gray-500">Keep tracking your mood to see insights!</p>';
      }
    }

    // Display patterns
    const patternsContainer = document.getElementById('patterns-container');
    if (patternsContainer) {
      if (data.patterns && data.patterns.length > 0) {
        patternsContainer.innerHTML = data.patterns.map(pattern => `
          <div class="p-3 rounded-lg bg-purple-50 border-l-4 border-purple-500">
            <div class="flex items-start space-x-2">
              <span class="text-2xl">${pattern.icon}</span>
              <p class="text-gray-700">${pattern.message}</p>
            </div>
          </div>
        `).join('');
      } else {
        patternsContainer.innerHTML = '<p class="text-gray-500">No patterns detected yet. Keep tracking!</p>';
      }
    }

    // Display recommendations
    const recommendationsContainer = document.getElementById('recommendations-container');
    if (recommendationsContainer) {
      if (data.recommendations && data.recommendations.length > 0) {
        recommendationsContainer.innerHTML = data.recommendations.map(rec => `
          <div class="flex items-start space-x-2 p-2">
            <span class="text-purple-600">•</span>
            <p class="text-gray-700">${rec}</p>
          </div>
        `).join('');
      }
    }

    // Display stats
    const statsContainer = document.getElementById('stats-container');
    if (statsContainer && data.stats) {
      statsContainer.innerHTML = `
        <div class="text-center p-4 bg-purple-50 rounded-lg">
          <p class="text-3xl font-bold text-purple-600">${data.stats.averageMood}</p>
          <p class="text-sm text-gray-600">Average Mood</p>
        </div>
        <div class="text-center p-4 bg-teal-50 rounded-lg">
          <p class="text-3xl font-bold text-teal-600">${data.stats.totalEntries}</p>
          <p class="text-sm text-gray-600">Total Entries</p>
        </div>
        <div class="text-center p-4 bg-blue-50 rounded-lg">
          <p class="text-3xl font-bold text-blue-600">${data.stats.trend > 0 ? '+' : ''}${data.stats.trend}</p>
          <p class="text-sm text-gray-600">Mood Trend</p>
        </div>
        <div class="text-center p-4 bg-green-50 rounded-lg">
          <p class="text-3xl font-bold text-green-600">${data.stats.daysTracked}</p>
          <p class="text-sm text-gray-600">Days Tracked</p>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error loading insights:', error);
    showToast('Failed to load insights', 'error');
  }
}


