// Dark mode toggle with system preference detection
export const initDarkMode = () => {
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  
  // Check for saved theme preference or default to system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  
  // Apply theme immediately
  document.documentElement.setAttribute('data-theme', currentTheme);
  if (darkModeToggle) {
    darkModeToggle.setAttribute('aria-pressed', currentTheme === 'dark');
    // Update toggle icon/text if needed
    const iconSpan = darkModeToggle?.querySelector('.dark-mode-icon');
    const textSpan = darkModeToggle?.querySelector('.dark-mode-text');
    if (iconSpan) {
      iconSpan.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
    }
    if (textSpan) {
      textSpan.textContent = currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
    } else if (darkModeToggle?.textContent) {
      darkModeToggle.textContent = currentTheme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
    }
  }
  
  // Listen for system theme changes
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      // Only auto-switch if user hasn't manually set a preference
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        if (darkModeToggle) {
          darkModeToggle.setAttribute('aria-pressed', newTheme === 'dark');
          const iconSpan = darkModeToggle.querySelector('.dark-mode-icon');
          const textSpan = darkModeToggle.querySelector('.dark-mode-text');
          if (iconSpan) {
            iconSpan.textContent = newTheme === 'dark' ? '☀️' : '🌙';
          }
          if (textSpan) {
            textSpan.textContent = newTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
          } else if (darkModeToggle.textContent) {
            darkModeToggle.textContent = newTheme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
          }
        }
      }
    });
  }
  
  // Toggle button handler
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const newTheme = isDark ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      darkModeToggle.setAttribute('aria-pressed', !isDark);
      
      // Update toggle icon/text
      const iconSpan = darkModeToggle.querySelector('.dark-mode-icon');
      const textSpan = darkModeToggle.querySelector('.dark-mode-text');
      if (iconSpan) {
        iconSpan.textContent = newTheme === 'dark' ? '☀️' : '🌙';
      }
      if (textSpan) {
        textSpan.textContent = newTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
      } else if (darkModeToggle.textContent) {
        darkModeToggle.textContent = newTheme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
      }
      
      // Show feedback
      const event = new CustomEvent('theme-changed', { detail: { theme: newTheme } });
      window.dispatchEvent(event);
    });
  }
};

// High contrast toggle
export const initHighContrast = () => {
  const contrastToggle = document.getElementById('high-contrast-toggle');
  const isHighContrast = localStorage.getItem('highContrast') === 'true';
  
  if (isHighContrast) {
    document.body.classList.add('high-contrast');
    if (contrastToggle) contrastToggle.setAttribute('aria-pressed', 'true');
  }
  
  if (contrastToggle) {
    contrastToggle.addEventListener('click', () => {
      const isActive = document.body.classList.toggle('high-contrast');
      localStorage.setItem('highContrast', isActive);
      contrastToggle.setAttribute('aria-pressed', isActive);
    });
  }
};

// Text-to-speech
export const initTextToSpeech = () => {
  const ttsToggle = document.getElementById('text-to-speech-toggle');
  let synth = window.speechSynthesis;
  
  if (ttsToggle) {
    ttsToggle.addEventListener('click', () => {
      const isActive = ttsToggle.getAttribute('aria-pressed') === 'true';
      
      if (isActive) {
        synth.cancel();
        ttsToggle.setAttribute('aria-pressed', 'false');
      } else {
        const text = document.querySelector('main')?.textContent || '';
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        synth.speak(utterance);
        ttsToggle.setAttribute('aria-pressed', 'true');
        
        utterance.onend = () => {
          ttsToggle.setAttribute('aria-pressed', 'false');
        };
      }
    });
  }
};

// Font size adjustment
export const initFontSize = () => {
  const fontSizeSlider = document.getElementById('font-size');
  const fontSizeValue = document.getElementById('font-size-value');
  const savedSize = localStorage.getItem('fontSize') || '16';
  
  document.documentElement.style.fontSize = `${savedSize}px`;
  if (fontSizeSlider) fontSizeSlider.value = savedSize;
  if (fontSizeValue) fontSizeValue.textContent = `${savedSize}px`;
  
  if (fontSizeSlider) {
    fontSizeSlider.addEventListener('input', (e) => {
      const size = e.target.value;
      document.documentElement.style.fontSize = `${size}px`;
      localStorage.setItem('fontSize', size);
      if (fontSizeValue) fontSizeValue.textContent = `${size}px`;
    });
  }
};

// Initialize all accessibility features
export const initAccessibility = () => {
  initDarkMode();
  initHighContrast();
  initTextToSpeech();
  initFontSize();
};

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAccessibility);
} else {
  initAccessibility();
}

