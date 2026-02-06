// Enhanced Journaling Features
// Journal prompts, voice-to-text, templates

class JournalEnhancements {
  constructor() {
    this.isRecording = false;
    this.recognition = null;
    this.init();
  }

  init() {
    this.initVoiceRecognition();
    this.addJournalPrompts();
    this.addTemplates();
  }

  initVoiceRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const journalContent = document.getElementById('journal-content');
        if (journalContent) {
          journalContent.value += (journalContent.value ? ' ' : '') + transcript;
          journalContent.dispatchEvent(new Event('input'));
        }
      };

      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        alert('Speech recognition error. Please try again.');
      };
    }
  }

  addJournalPrompts() {
    const prompts = [
      "What's one thing you're grateful for today?",
      "How are you feeling right now?",
      "What's been on your mind lately?",
      "What's one challenge you faced today?",
      "What's one thing that made you smile?",
      "What would you tell your past self?",
      "What are you looking forward to?",
      "What's something you learned about yourself?",
      "How did you take care of yourself today?",
      "What's one thing you'd like to change?",
      "What are three things that went well today?",
      "What's something you're proud of?",
      "What's a goal you're working towards?",
      "How can you be kinder to yourself?",
      "What's something you need to let go of?"
    ];

    // Add prompts button to journal page
    const journalForm = document.getElementById('journal-form');
    if (journalForm) {
      const promptsContainer = document.createElement('div');
      promptsContainer.className = 'mb-4';
      promptsContainer.innerHTML = `
        <button type="button" id="show-prompts-btn" class="btn-secondary text-sm mb-2">
          💡 Get Writing Prompt
        </button>
        <div id="prompt-display" class="hidden p-3 bg-purple-50 rounded-lg border border-purple-200 mb-3">
          <p class="text-gray-700 font-medium" id="current-prompt"></p>
          <button type="button" id="new-prompt-btn" class="text-sm text-purple-600 hover:text-purple-700 mt-2">
            Get Another Prompt
          </button>
        </div>
      `;
      
      journalForm.insertBefore(promptsContainer, journalForm.firstChild);
      
      const showPromptsBtn = document.getElementById('show-prompts-btn');
      const promptDisplay = document.getElementById('prompt-display');
      const currentPrompt = document.getElementById('current-prompt');
      const newPromptBtn = document.getElementById('new-prompt-btn');
      const journalContent = document.getElementById('journal-content');

      showPromptsBtn.addEventListener('click', () => {
        const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
        currentPrompt.textContent = randomPrompt;
        promptDisplay.classList.remove('hidden');
        
        // Optionally insert prompt into textarea
        if (journalContent && !journalContent.value.trim()) {
          journalContent.value = randomPrompt + '\n\n';
          journalContent.focus();
        }
      });

      newPromptBtn.addEventListener('click', () => {
        const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
        currentPrompt.textContent = randomPrompt;
      });
    }
  }

  addTemplates() {
    const templates = {
      'gratitude': {
        title: 'Gratitude Journal',
        content: 'Today I am grateful for:\n\n1. \n2. \n3. \n\nWhy these matter to me:\n\n'
      },
      'reflection': {
        title: 'Daily Reflection',
        content: 'How am I feeling today?\n\nWhat happened today?\n\nWhat did I learn?\n\nWhat can I do differently tomorrow?\n\n'
      },
      'goal': {
        title: 'Goal Progress',
        content: 'Goal: \n\nProgress made:\n\nChallenges faced:\n\nNext steps:\n\n'
      },
      'mood': {
        title: 'Mood Exploration',
        content: 'Current mood: \n\nWhat triggered this mood?\n\nHow does my body feel?\n\nWhat thoughts are present?\n\nWhat can help me feel better?\n\n'
      }
    };

    const journalForm = document.getElementById('journal-form');
    if (journalForm) {
      const templatesContainer = document.createElement('div');
      templatesContainer.className = 'mb-4';
      templatesContainer.innerHTML = `
        <label class="block text-sm font-medium text-gray-700 mb-2">Journal Templates:</label>
        <div class="flex flex-wrap gap-2">
          <button type="button" class="template-btn btn-secondary text-sm" data-template="gratitude">🙏 Gratitude</button>
          <button type="button" class="template-btn btn-secondary text-sm" data-template="reflection">🤔 Reflection</button>
          <button type="button" class="template-btn btn-secondary text-sm" data-template="goal">🎯 Goal Progress</button>
          <button type="button" class="template-btn btn-secondary text-sm" data-template="mood">😊 Mood Exploration</button>
        </div>
      `;
      
      const titleInput = document.getElementById('journal-title');
      const contentInput = document.getElementById('journal-content');
      
      if (titleInput && contentInput) {
        journalForm.insertBefore(templatesContainer, titleInput.parentElement);
        
        document.querySelectorAll('.template-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const template = templates[btn.dataset.template];
            if (template) {
              if (!titleInput.value.trim()) {
                titleInput.value = template.title;
              }
              if (!contentInput.value.trim()) {
                contentInput.value = template.content;
                contentInput.focus();
              } else {
                contentInput.value += '\n\n' + template.content;
                contentInput.focus();
              }
            }
          });
        });
      }
    }
  }

  addVoiceButton() {
    const journalContent = document.getElementById('journal-content');
    if (journalContent && this.recognition) {
      const voiceBtn = document.createElement('button');
      voiceBtn.type = 'button';
      voiceBtn.className = 'btn-secondary text-sm mb-2';
      voiceBtn.innerHTML = '🎤 Voice to Text';
      voiceBtn.addEventListener('click', () => this.toggleVoiceRecognition());
      
      journalContent.parentElement.insertBefore(voiceBtn, journalContent);
    }
  }

  toggleVoiceRecognition() {
    if (!this.recognition) {
      alert('Voice recognition is not supported in your browser.');
      return;
    }

    if (this.isRecording) {
      this.recognition.stop();
      this.isRecording = false;
    } else {
      this.recognition.start();
      this.isRecording = true;
      alert('Listening... Speak now. Click again to stop.');
    }
  }
}

// Initialize enhancements
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new JournalEnhancements());
} else {
  new JournalEnhancements();
}


