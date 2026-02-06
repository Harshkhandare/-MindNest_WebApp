// Habit Tracking & Streaks
import { apiCall, requireAuth, showToast } from './utils.js';

class HabitTracker {
  constructor() {
    this.habits = [];
    this.init();
  }

  async init() {
    if (!requireAuth()) {
      return;
    }
    await this.loadHabits();
    this.renderHabits();
  }

  async loadHabits() {
    // Get habits from goals and mood/journal tracking
    try {
      const [goalsData, moodData] = await Promise.all([
        apiCall('/goals'),
        apiCall('/mood?limit=30')
      ]);

      // Create habits from goals
      this.habits = goalsData.goals
        .filter(g => g.type === 'daily' && (g.status === 'in-progress' || g.status === 'pending'))
        .map(goal => ({
          id: goal.id,
          name: goal.title,
          type: 'goal',
          currentStreak: this.calculateStreak(goal),
          longestStreak: goal.longestStreak || 0
        }));

      // Add mood tracking habit
      if (moodData.moods && moodData.moods.length > 0) {
        this.habits.push({
          id: 'mood-tracking',
          name: 'Mood Tracking',
          type: 'mood',
          currentStreak: this.calculateMoodStreak(moodData.moods),
          longestStreak: this.calculateLongestMoodStreak(moodData.moods)
        });
      }
    } catch (error) {
      console.error('Error loading habits:', error);
    }
  }

  calculateStreak(goal) {
    // Calculate streak based on goal progress updates
    // This is a simplified version - you'd track completion dates in real implementation
    return 0; // Placeholder
  }

  calculateMoodStreak(moods) {
    if (!moods || moods.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < moods.length; i++) {
      const moodDate = new Date(moods[i].date);
      moodDate.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((today - moodDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === i) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }

  calculateLongestMoodStreak(moods) {
    if (!moods || moods.length === 0) return 0;
    
    let longestStreak = 0;
    let currentStreak = 0;
    const sortedMoods = [...moods].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    for (let i = 0; i < sortedMoods.length - 1; i++) {
      const date1 = new Date(sortedMoods[i].date);
      const date2 = new Date(sortedMoods[i + 1].date);
      const daysDiff = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
    
    return longestStreak + 1; // +1 to include the starting day
  }

  renderHabits() {
    const container = document.getElementById('habits-container');
    if (!container) return;

    if (this.habits.length === 0) {
      container.innerHTML = '<p class="text-gray-500">No active habits to track. Create daily goals to start tracking habits!</p>';
      return;
    }

    container.innerHTML = this.habits.map(habit => `
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-semibold text-lg">${habit.name}</h3>
            <p class="text-sm text-gray-600">Current streak: <span class="font-bold text-purple-600">${habit.currentStreak} days</span></p>
            <p class="text-sm text-gray-600">Longest streak: ${habit.longestStreak} days</p>
          </div>
          <div class="text-right">
            ${habit.currentStreak >= 7 ? '<span class="text-3xl">🔥</span>' : ''}
            ${habit.currentStreak >= 30 ? '<span class="text-3xl">⭐</span>' : ''}
            ${habit.currentStreak >= 100 ? '<span class="text-3xl">🏆</span>' : ''}
          </div>
        </div>
        <div class="mt-3">
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-purple-600 h-2 rounded-full" style="width: ${Math.min((habit.currentStreak / 30) * 100, 100)}%"></div>
          </div>
        </div>
      </div>
    `).join('');
  }
}

// Initialize on dashboard
if (window.location.pathname.includes('dashboard.html')) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new HabitTracker());
  } else {
    new HabitTracker();
  }
}


