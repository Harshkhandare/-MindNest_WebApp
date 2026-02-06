// Detect environment and set API URL accordingly
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const isNetlify = window.location.hostname.includes('netlify');

// For production, you'll need to deploy your backend separately (Render, Railway, etc.)
// Update this URL with your deployed backend URL
// For demo/hackathon: Set DEMO_MODE to true to show UI without backend
export const DEMO_MODE = isNetlify && !window.location.search.includes('backend=true');

export const API_BASE_URL = isProduction 
  ? (isNetlify 
      ? (DEMO_MODE 
          ? null // Demo mode - no API calls
          : 'https://your-backend-url.onrender.com/api') // Replace with your actual backend URL
      : `${window.location.origin}/api`)
  : 'http://localhost:3000/api';

export const TOKEN_KEY = 'mindnest_token';
export const USER_KEY = 'mindnest_user';

