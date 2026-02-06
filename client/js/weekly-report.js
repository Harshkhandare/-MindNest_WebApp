import { apiCall, requireAuth, formatDate } from './utils.js';

// Weekly Wellness Report
class WeeklyReport {
  constructor() {
    this.init();
  }

  async init() {
    if (!requireAuth()) {
      return;
    }
    await this.loadReport();
  }

  async loadReport() {
    try {
      const data = await apiCall('/insights/weekly-report');
      this.displayReport(data);
    } catch (error) {
      console.error('Error loading weekly report:', error);
    }
  }

  displayReport(data) {
    const container = document.getElementById('weekly-report-container');
    if (!container) return;

    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <h3 class="text-sm font-medium opacity-90 mb-1">Average Mood</h3>
          <p class="text-3xl font-bold">${data.mood.average || 'N/A'}</p>
          <p class="text-sm opacity-75 mt-1">${data.mood.entries || 0} entries</p>
        </div>
        
        <div class="card bg-gradient-to-br from-teal-500 to-teal-600 text-white">
          <h3 class="text-sm font-medium opacity-90 mb-1">Mood Trend</h3>
          <p class="text-3xl font-bold">${data.mood.trend ? (data.mood.trend > 0 ? '+' : '') + data.mood.trend : 'N/A'}</p>
          <p class="text-sm opacity-75 mt-1">This week</p>
        </div>
        
        <div class="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <h3 class="text-sm font-medium opacity-90 mb-1">Journal Entries</h3>
          <p class="text-3xl font-bold">${data.journal.entries || 0}</p>
          <p class="text-sm opacity-75 mt-1">This week</p>
        </div>
        
        <div class="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <h3 class="text-sm font-medium opacity-90 mb-1">Active Goals</h3>
          <p class="text-3xl font-bold">${data.goals.active || 0}</p>
          <p class="text-sm opacity-75 mt-1">${data.goals.averageProgress || 0}% progress</p>
        </div>
      </div>
      
      <div class="card">
        <h3 class="text-xl font-semibold mb-4">Week Summary</h3>
        <p class="text-gray-700 leading-relaxed">${data.summary || 'Keep tracking to see your weekly summary!'}</p>
      </div>
      
      ${data.mood.bestDay !== null ? `
        <div class="card mt-4">
          <h3 class="text-lg font-semibold mb-2">Mood Range</h3>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Best Day</p>
              <p class="text-2xl font-bold text-green-600">${data.mood.bestDay}/10</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Lowest Day</p>
              <p class="text-2xl font-bold text-red-600">${data.mood.worstDay}/10</p>
            </div>
          </div>
        </div>
      ` : ''}
    `;
  }
}

// Initialize if on dashboard
if (window.location.pathname.includes('dashboard.html')) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new WeeklyReport());
  } else {
    new WeeklyReport();
  }
}


