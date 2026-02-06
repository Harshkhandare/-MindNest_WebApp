// Self-Care Activity Library
class SelfCareLibrary {
  constructor() {
    this.activities = [
      {
        category: 'Physical',
        activities: [
          { name: 'Take a 10-minute walk', duration: 10, icon: '🚶' },
          { name: 'Do 5 minutes of stretching', duration: 5, icon: '🧘' },
          { name: 'Drink a glass of water', duration: 1, icon: '💧' },
          { name: 'Take a warm shower', duration: 15, icon: '🚿' },
          { name: 'Get 8 hours of sleep', duration: 480, icon: '😴' }
        ]
      },
      {
        category: 'Mental',
        activities: [
          { name: 'Practice deep breathing', duration: 5, icon: '🫁' },
          { name: 'Read for 15 minutes', duration: 15, icon: '📚' },
          { name: 'Listen to calming music', duration: 20, icon: '🎵' },
          { name: 'Do a puzzle or brain game', duration: 15, icon: '🧩' },
          { name: 'Practice mindfulness', duration: 10, icon: '🧘' }
        ]
      },
      {
        category: 'Emotional',
        activities: [
          { name: 'Write in your journal', duration: 15, icon: '📝' },
          { name: 'Call a friend', duration: 20, icon: '📞' },
          { name: 'Practice gratitude', duration: 5, icon: '🙏' },
          { name: 'Watch a favorite show', duration: 30, icon: '📺' },
          { name: 'Do something creative', duration: 30, icon: '🎨' }
        ]
      },
      {
        category: 'Social',
        activities: [
          { name: 'Reach out to a loved one', duration: 15, icon: '💬' },
          { name: 'Join a support group', duration: 60, icon: '👥' },
          { name: 'Volunteer or help someone', duration: 60, icon: '🤝' },
          { name: 'Spend time with pets', duration: 30, icon: '🐾' }
        ]
      }
    ];
    this.init();
  }

  init() {
    this.renderLibrary();
  }

  renderLibrary() {
    const container = document.getElementById('self-care-library');
    if (!container) return;

    container.innerHTML = this.activities.map(category => `
      <div class="card mb-6">
        <h3 class="text-xl font-semibold mb-4">${category.category} Self-Care</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${category.activities.map(activity => `
            <div class="p-4 border border-gray-200 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer self-care-activity" 
                 data-name="${activity.name}" 
                 data-duration="${activity.duration}">
              <div class="flex items-center space-x-3">
                <span class="text-3xl">${activity.icon}</span>
                <div class="flex-1">
                  <p class="font-semibold">${activity.name}</p>
                  <p class="text-sm text-gray-600">${activity.duration} min</p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');

    // Add click handlers
    container.querySelectorAll('.self-care-activity').forEach(item => {
      item.addEventListener('click', () => {
        const name = item.dataset.name;
        const duration = item.dataset.duration;
        this.startActivity(name, duration);
      });
    });
  }

  startActivity(name, duration) {
    // Create activity timer
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-2xl font-semibold mb-4">${name}</h3>
        <p class="text-gray-600 mb-4">Take your time with this activity. There's no rush.</p>
        <div class="text-center mb-4">
          <p class="text-sm text-gray-500">Suggested duration: ${duration} minutes</p>
        </div>
        <div class="flex space-x-3">
          <button class="btn-primary flex-1" id="complete-activity">Mark Complete</button>
          <button class="btn-secondary flex-1" id="cancel-activity">Cancel</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('#complete-activity').addEventListener('click', () => {
      // Save activity to user's activity log (would need backend)
      alert(`Great job completing "${name}"! Keep up the self-care! 💚`);
      modal.remove();
    });
    
    modal.querySelector('#cancel-activity').addEventListener('click', () => {
      modal.remove();
    });
  }
}

// Initialize if on self-care page
if (document.getElementById('self-care-library')) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new SelfCareLibrary());
  } else {
    new SelfCareLibrary();
  }
}


