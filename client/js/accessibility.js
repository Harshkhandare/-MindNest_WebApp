// Import showToast for user feedback
import { showToast } from './utils.js';

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
  const textToSpeechCheckbox = document.getElementById('textToSpeech');
  let synth = window.speechSynthesis;
  
  // Function to read main content
  const readMainContent = () => {
    if (!('speechSynthesis' in window)) {
      showToast('Text-to-speech is not supported in your browser.', 'error');
      return;
    }
    
    synth.cancel(); // Cancel any ongoing speech
    
    const mainContent = document.querySelector('main');
    if (!mainContent) {
      showToast('No content found to read.', 'error');
      return;
    }
    
    // Get text content, excluding script tags and hidden elements
    const text = Array.from(mainContent.querySelectorAll('*'))
      .filter(el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && 
               style.visibility !== 'hidden' && 
               el.tagName !== 'SCRIPT' && 
               el.tagName !== 'STYLE' &&
               el.tagName !== 'BUTTON' &&
               !el.closest('nav') &&
               !el.closest('header');
      })
      .map(el => {
        // Get direct text content, not nested
        return Array.from(el.childNodes)
          .filter(node => node.nodeType === Node.TEXT_NODE)
          .map(node => node.textContent.trim())
          .filter(text => text.length > 0)
          .join(' ');
      })
      .filter(text => text.length > 0)
      .join('. ')
      .replace(/\s+/g, ' ')
      .trim();
    
    if (text) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      synth.speak(utterance);
      
      utterance.onend = () => {
        if (ttsToggle) ttsToggle.setAttribute('aria-pressed', 'false');
        if (textToSpeechCheckbox) textToSpeechCheckbox.checked = false;
      };
      
      utterance.onerror = (e) => {
        console.error('Speech synthesis error:', e);
        if (ttsToggle) ttsToggle.setAttribute('aria-pressed', 'false');
        if (textToSpeechCheckbox) textToSpeechCheckbox.checked = false;
      };
      
      if (ttsToggle) ttsToggle.setAttribute('aria-pressed', 'true');
      if (textToSpeechCheckbox) textToSpeechCheckbox.checked = true;
    } else {
      showToast('No readable content found.', 'error');
    }
  };
  
  // Handle toggle button (if exists)
  if (ttsToggle) {
    ttsToggle.addEventListener('click', () => {
      const isActive = ttsToggle.getAttribute('aria-pressed') === 'true';
      
      if (isActive) {
        synth.cancel();
        ttsToggle.setAttribute('aria-pressed', 'false');
        if (textToSpeechCheckbox) textToSpeechCheckbox.checked = false;
      } else {
        readMainContent();
      }
    });
  }
  
  // Handle preferences checkbox (if exists)
  if (textToSpeechCheckbox) {
    textToSpeechCheckbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        readMainContent();
      } else {
        synth.cancel();
        if (ttsToggle) ttsToggle.setAttribute('aria-pressed', 'false');
      }
    });
    
    // Auto-read if preference is enabled on page load
    const savedTTS = localStorage.getItem('textToSpeech') === 'true';
    if (savedTTS && textToSpeechCheckbox.checked) {
      // Small delay to ensure page is fully loaded
      setTimeout(() => {
        readMainContent();
      }, 500);
    }
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

