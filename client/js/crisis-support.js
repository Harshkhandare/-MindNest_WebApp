// Crisis Support & Safety Features
// Always accessible emergency resources

class CrisisSupport {
  constructor() {
    this.init();
  }

  init() {
    this.createCrisisButton();
    this.createCrisisModal();
  }

  createCrisisButton() {
    // Create floating crisis support button
    const button = document.createElement('button');
    button.id = 'crisis-support-btn';
    button.className = 'fixed bottom-6 right-6 z-50 bg-red-600 hover:bg-red-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110';
    button.setAttribute('aria-label', 'Crisis Support - Get Help Now');
    button.innerHTML = `
      <span class="text-2xl" aria-hidden="true">🆘</span>
      <span class="sr-only">Crisis Support</span>
    `;
    button.addEventListener('click', () => this.showCrisisModal());
    document.body.appendChild(button);
  }

  createCrisisModal() {
    const modal = document.createElement('div');
    modal.id = 'crisis-modal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'crisis-modal-title');
    
    modal.innerHTML = `
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 id="crisis-modal-title" class="text-3xl font-bold text-red-600">🆘 Crisis Support</h2>
            <button class="close-crisis-modal text-3xl text-gray-500 hover:text-gray-700" aria-label="Close">&times;</button>
          </div>
          
          <div class="space-y-6">
            <div class="bg-red-50 border-l-4 border-red-600 p-4">
              <p class="text-lg font-semibold text-red-800 mb-2">You're not alone. Help is available.</p>
              <p class="text-gray-700">If you're in immediate danger, please call emergency services now.</p>
            </div>

            <section>
              <h3 class="text-xl font-semibold mb-4">Emergency Hotlines</h3>
              <div class="space-y-3">
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p class="font-semibold">988 Suicide & Crisis Lifeline</p>
                    <p class="text-sm text-gray-600">Available 24/7, free and confidential</p>
                  </div>
                  <a href="tel:988" class="btn-primary">Call 988</a>
                </div>
                
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p class="font-semibold">Crisis Text Line</p>
                    <p class="text-sm text-gray-600">Text HOME to 741741</p>
                  </div>
                  <a href="sms:741741&body=HOME" class="btn-secondary">Text Now</a>
                </div>
                
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p class="font-semibold">Emergency Services</p>
                    <p class="text-sm text-gray-600">For immediate danger</p>
                  </div>
                  <a href="tel:911" class="btn-primary bg-red-600 hover:bg-red-700">Call 911</a>
                </div>
              </div>
            </section>

            <section>
              <h3 class="text-xl font-semibold mb-4">Quick Coping Strategies</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button class="coping-quick-btn p-3 bg-purple-50 rounded-lg hover:bg-purple-100 text-left" data-action="breathing">
                  <span class="text-xl">🫁</span>
                  <p class="font-semibold">Breathing Exercise</p>
                </button>
                <button class="coping-quick-btn p-3 bg-teal-50 rounded-lg hover:bg-teal-100 text-left" data-action="grounding">
                  <span class="text-xl">🌍</span>
                  <p class="font-semibold">5-4-3-2-1 Grounding</p>
                </button>
                <button class="coping-quick-btn p-3 bg-blue-50 rounded-lg hover:bg-blue-100 text-left" data-action="distract">
                  <span class="text-xl">🎯</span>
                  <p class="font-semibold">Distraction Techniques</p>
                </button>
                <a href="coping.html" class="coping-quick-btn p-3 bg-green-50 rounded-lg hover:bg-green-100 text-left">
                  <span class="text-xl">🧘</span>
                  <p class="font-semibold">More Coping Tools</p>
                </a>
              </div>
            </section>

            <section>
              <h3 class="text-xl font-semibold mb-4">Safety Plan</h3>
              <div class="bg-blue-50 p-4 rounded-lg">
                <p class="mb-3">Create a safety plan to use during crisis:</p>
                <a href="safety-plan.html" class="btn-secondary">Create Safety Plan</a>
              </div>
            </section>

            <section>
              <h3 class="text-xl font-semibold mb-4">Remember</h3>
              <ul class="space-y-2 text-gray-700">
                <li>✓ Your feelings are valid</li>
                <li>✓ This moment will pass</li>
                <li>✓ You deserve support</li>
                <li>✓ Help is available 24/7</li>
                <li>✓ You are not alone</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal handlers
    modal.querySelector('.close-crisis-modal').addEventListener('click', () => this.hideCrisisModal());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.hideCrisisModal();
    });
    
    // Coping quick buttons
    modal.querySelectorAll('.coping-quick-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.currentTarget.dataset.action;
        if (action === 'breathing') {
          window.location.href = 'coping.html#breathing';
        } else if (action === 'grounding') {
          window.location.href = 'coping.html#grounding';
        } else if (action === 'distract') {
          this.showDistractionTechniques();
        }
        this.hideCrisisModal();
      });
    });
  }

  showCrisisModal() {
    const modal = document.getElementById('crisis-modal');
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  }

  hideCrisisModal() {
    const modal = document.getElementById('crisis-modal');
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  showDistractionTechniques() {
    const techniques = [
      'Listen to calming music',
      'Call a friend or family member',
      'Take a walk outside',
      'Do a puzzle or game',
      'Watch a favorite show',
      'Read a book',
      'Write in your journal',
      'Do some light exercise',
      'Practice mindfulness',
      'Engage in a hobby'
    ];
    
    alert(`Distraction Techniques:\n\n${techniques.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n\nTry one of these activities to help shift your focus.`);
  }
}

// Initialize crisis support on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new CrisisSupport());
} else {
  new CrisisSupport();
}


