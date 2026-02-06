// Demo mode detection and banner display
import { DEMO_MODE } from './config.js';

if (DEMO_MODE) {
  // Show demo banner
  const banner = document.getElementById('demo-banner');
  if (banner) {
    banner.style.display = 'block';
  }
  
  // Add demo mode indicator to console
  console.log('%c🎭 DEMO MODE ACTIVE', 'color: #f59e0b; font-size: 16px; font-weight: bold;');
  console.log('This is a frontend-only demo. Backend features require separate deployment.');
  console.log('To use with backend, deploy backend separately and update API_BASE_URL in config.js');
}

