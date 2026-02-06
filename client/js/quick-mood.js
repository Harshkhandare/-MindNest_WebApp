// Quick Mood Check-in Widget
// Floating widget for quick mood entry
import { getAuthToken } from './utils.js';

class QuickMoodWidget {
  constructor() {
    this.isOpen = false;
    this.init();
  }

  init() {
    this.createWidget();
    this.checkIfMoodLoggedToday();
  }

  async checkIfMoodLoggedToday() {
    try {
      const token = getAuthToken();
      if (!token) return; // Not logged in

      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`/api/mood?startDate=${today}&endDate=${new Date().toISOString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.moods && data.moods.length > 0) {
          // Mood already logged today, hide widget or show different message
          const widget = document.getElementById('quick-mood-widget');
          if (widget) {
            widget.innerHTML = `
              <button class="quick-mood-btn text-sm" aria-label="Update today's mood">
                <span>✓</span> Logged
              </button>
            `;
          }
        }
      }
    } catch (error) {
      console.error('Error checking mood:', error);
    }
  }

  createWidget() {
    const widget = document.createElement('div');
    widget.id = 'quick-mood-widget';
    widget.className = 'fixed bottom-24 right-6 z-40';
    
    widget.innerHTML = `
      <button id="quick-mood-btn" class="quick-mood-btn bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6 py-3 shadow-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2" aria-label="Quick mood check-in">
        <span class="text-xl">😊</span>
        <span>How are you?</span>
      </button>
      
      <div id="quick-mood-panel" class="hidden absolute bottom-16 right-0 bg-white rounded-lg shadow-xl p-4 w-80 max-w-[90vw] border border-gray-200">
        <h3 class="font-semibold mb-3">Quick Mood Check-in</h3>
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Mood Level:</span>
            <span id="quick-mood-value" class="font-semibold">5</span>
          </div>
          <input 
            type="range" 
            id="quick-mood-slider" 
            min="1" 
            max="10" 
            value="5" 
            class="w-full"
            aria-label="Mood level slider"
          >
          <div class="flex justify-between text-xs text-gray-500">
            <span>😢</span>
            <span>😊</span>
          </div>
          
          <div class="flex flex-wrap gap-2 mt-3">
            <button class="emotion-btn px-3 py-1 text-sm rounded-full border border-gray-300 hover:bg-purple-50" data-emotion="happy">😊 Happy</button>
            <button class="emotion-btn px-3 py-1 text-sm rounded-full border border-gray-300 hover:bg-purple-50" data-emotion="sad">😢 Sad</button>
            <button class="emotion-btn px-3 py-1 text-sm rounded-full border border-gray-300 hover:bg-purple-50" data-emotion="anxious">😰 Anxious</button>
            <button class="emotion-btn px-3 py-1 text-sm rounded-full border border-gray-300 hover:bg-purple-50" data-emotion="calm">😌 Calm</button>
          </div>
          
          <button id="quick-mood-save" class="w-full btn-primary mt-3">
            Save Mood
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(widget);
    this.attachEventListeners();
  }

  attachEventListeners() {
    const btn = document.getElementById('quick-mood-btn');
    const panel = document.getElementById('quick-mood-panel');
    const slider = document.getElementById('quick-mood-slider');
    const valueDisplay = document.getElementById('quick-mood-value');
    const saveBtn = document.getElementById('quick-mood-save');
    const emotionBtns = document.querySelectorAll('.emotion-btn');

    // Toggle panel
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.togglePanel();
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isOpen && !panel.contains(e.target) && !btn.contains(e.target)) {
        this.closePanel();
      }
    });

    // Update value display
    if (slider && valueDisplay) {
      slider.addEventListener('input', (e) => {
        valueDisplay.textContent = e.target.value;
      });
    }

    // Emotion buttons
    emotionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        emotionBtns.forEach(b => b.classList.remove('bg-purple-100', 'border-purple-500'));
        btn.classList.add('bg-purple-100', 'border-purple-500');
      });
    });

    // Save mood
    if (saveBtn) {
      saveBtn.addEventListener('click', () => this.saveMood());
    }
  }

  togglePanel() {
    const panel = document.getElementById('quick-mood-panel');
    if (panel) {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        panel.classList.remove('hidden');
      } else {
        panel.classList.add('hidden');
      }
    }
  }

  closePanel() {
    const panel = document.getElementById('quick-mood-panel');
    if (panel) {
      this.isOpen = false;
      panel.classList.add('hidden');
    }
  }

  async saveMood() {
    const token = getAuthToken();
    if (!token) {
      alert('Please login to save your mood');
      window.location.href = 'login.html';
      return;
    }

    const slider = document.getElementById('quick-mood-slider');
    const emotionBtns = document.querySelectorAll('.emotion-btn');
    const selectedEmotion = Array.from(emotionBtns).find(btn => 
      btn.classList.contains('bg-purple-100')
    );

    const moodData = {
      moodLevel: parseInt(slider.value),
      emotion: selectedEmotion ? selectedEmotion.dataset.emotion : 'neutral'
    };

    try {
      const response = await fetch('/api/mood', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(moodData)
      });

      if (response.ok) {
        // Show success
        const btn = document.getElementById('quick-mood-btn');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<span>✓ Saved!</span>';
        btn.classList.add('bg-green-600');
        
        this.closePanel();
        
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.classList.remove('bg-green-600');
        }, 2000);

        // Update widget to show logged
        this.checkIfMoodLoggedToday();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to save mood');
      }
    } catch (error) {
      console.error('Error saving mood:', error);
      alert('Failed to save mood. Please try again.');
    }
  }
}

// Initialize widget
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new QuickMoodWidget());
} else {
  new QuickMoodWidget();
}


