// Mood Calendar Heatmap
import { apiCall, requireAuth } from './utils.js';

class MoodCalendar {
  constructor() {
    this.moods = [];
    this.init();
  }

  async init() {
    if (!requireAuth()) {
      return;
    }
    await this.loadMoods();
    this.renderCalendar();
  }

  async loadMoods() {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 3); // Last 3 months

      const data = await apiCall(`/mood?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
      this.moods = data.moods || [];
    } catch (error) {
      console.error('Error loading moods for calendar:', error);
    }
  }

  renderCalendar() {
    const container = document.getElementById('mood-calendar');
    if (!container) return;

    const today = new Date();
    const months = [];
    
    // Generate last 3 months
    for (let i = 2; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push(this.generateMonth(date));
    }

    container.innerHTML = months.map(month => `
      <div class="mb-8">
        <h3 class="text-xl font-semibold mb-4">${month.monthName} ${month.year}</h3>
        <div class="grid grid-cols-7 gap-1">
          ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => `
            <div class="text-xs text-gray-500 text-center py-1">${day}</div>
          `).join('')}
          ${month.days.map(day => `
            <div class="aspect-square flex items-center justify-center text-xs ${day.mood ? this.getMoodColor(day.mood) : 'bg-gray-100'} rounded ${day.isToday ? 'ring-2 ring-purple-500' : ''}" 
                 title="${day.date.toLocaleDateString()}${day.mood ? ` - Mood: ${day.mood}/10` : ''}">
              ${day.date.getDate()}
            </div>
          `).join('')}
        </div>
        <div class="mt-4 flex items-center justify-center space-x-4 text-xs">
          <div class="flex items-center space-x-1">
            <div class="w-3 h-3 bg-red-200 rounded"></div>
            <span>Low (1-3)</span>
          </div>
          <div class="flex items-center space-x-1">
            <div class="w-3 h-3 bg-yellow-200 rounded"></div>
            <span>Medium (4-7)</span>
          </div>
          <div class="flex items-center space-x-1">
            <div class="w-3 h-3 bg-green-200 rounded"></div>
            <span>High (8-10)</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  generateMonth(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    const today = new Date();
    
    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ date: null, mood: null, isToday: false });
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const dateStr = currentDate.toISOString().split('T')[0];
      const moodEntry = this.moods.find(m => {
        const moodDate = new Date(m.date).toISOString().split('T')[0];
        return moodDate === dateStr;
      });

      days.push({
        date: currentDate,
        mood: moodEntry ? moodEntry.moodLevel : null,
        isToday: currentDate.toDateString() === today.toDateString()
      });
    }

    return {
      monthName: date.toLocaleString('default', { month: 'long' }),
      year,
      days
    };
  }

  getMoodColor(moodLevel) {
    if (moodLevel >= 8) return 'bg-green-400 hover:bg-green-500';
    if (moodLevel >= 5) return 'bg-yellow-400 hover:bg-yellow-500';
    if (moodLevel >= 1) return 'bg-red-400 hover:bg-red-500';
    return 'bg-gray-200';
  }
}

// Initialize if calendar container exists
if (document.getElementById('mood-calendar')) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new MoodCalendar());
  } else {
    new MoodCalendar();
  }
}


