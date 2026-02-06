# Cursor Prompt: MindNest - Mental Health Support App

## PROJECT OVERVIEW

Build a professional, production-ready full-stack Mental Health Support Web Application named **"MindNest"** with tagline **"You're not alone. One step at a time."**

**Theme:** Calm, empathetic, trustworthy
**UI Reference Apps:** Headspace, Calm, Woebot, BetterHelp (UI inspiration)
**Goal:** Create a calming, empathetic, accessible mental health application focused on depression support with real backend logic, database integration, authentication, analytics, and polished UI.

---

## TECH STACK

### Frontend
- **HTML5** (Semantic tags, ARIA attributes)
- **CSS3** (Tailwind CSS CDN + Custom CSS)
- **JavaScript** (ES6+, Vanilla JS, Modular architecture)
- **Chart.js** (for mood analytics visualization)
- **Web Speech API** (Text-to-Speech for accessibility)
- **LocalStorage** (Token management)

### Backend
- **Node.js** (v18+)
- **Express.js** (REST API)
- **JWT** (jsonwebtoken for authentication)
- **bcryptjs** (Password hashing)
- **Mongoose** (MongoDB ODM)
- **dotenv** (Environment variables)
- **cors** (Cross-origin resource sharing)
- **express-validator** (Input validation)
- **nodemailer** (Email reminders)

### Database
- **MongoDB** (MongoDB Atlas or local)
- Collections: users, moods, journals, goals, posts, reminders

### Optional Enhancements
- **Socket.IO** (Real-time peer chat)
- **Firebase** (Push notifications)

---

## FOLDER STRUCTURE

```
mindnest/
│
├── client/
│   ├── index.html
│   ├── login.html
│   ├── signup.html
│   ├── dashboard.html
│   ├── mood.html
│   ├── journal.html
│   ├── community.html
│   ├── goals.html
│   ├── resources.html
│   ├── profile.html
│   ├── css/
│   │   ├── styles.css
│   │   └── accessibility.css
│   ├── js/
│   │   ├── config.js
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   ├── mood.js
│   │   ├── journal.js
│   │   ├── goals.js
│   │   ├── community.js
│   │   ├── reminders.js
│   │   ├── resources.js
│   │   ├── accessibility.js
│   │   └── utils.js
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│
├── server/
│   ├── app.js
│   ├── server.js
│   ├── .env.example
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── mood.routes.js
│   │   ├── journal.routes.js
│   │   ├── goals.routes.js
│   │   ├── community.routes.js
│   │   ├── resources.routes.js
│   │   ├── reminders.routes.js
│   │   └── user.routes.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── mood.controller.js
│   │   ├── journal.controller.js
│   │   ├── goals.controller.js
│   │   ├── community.controller.js
│   │   ├── resources.controller.js
│   │   ├── reminders.controller.js
│   │   └── user.controller.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Mood.js
│   │   ├── Journal.js
│   │   ├── Goal.js
│   │   ├── Post.js
│   │   └── Reminder.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── validation.middleware.js
│   ├── config/
│   │   ├── db.js
│   │   └── email.js
│   └── utils/
│       ├── encryption.js
│       └── helpers.js
│
├── package.json
├── .gitignore
└── README.md
```

---

## HTML STRUCTURE & ATTRIBUTES (PROFESSIONAL UI)

### Semantic HTML5 Tags
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="MindNest - Mental Health Support App">
  <title>MindNest - Dashboard</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body role="document">
  <header role="banner" class="header">
    <nav role="navigation" aria-label="Main navigation">
      <!-- Navigation items -->
    </nav>
  </header>
  
  <main role="main" id="main-content">
    <section aria-labelledby="dashboard-heading">
      <h1 id="dashboard-heading" class="sr-only">Dashboard</h1>
      <!-- Content -->
    </section>
  </main>
  
  <footer role="contentinfo">
    <!-- Footer content -->
  </footer>
</body>
</html>
```

### Key HTML Attributes for Professional UI

**Forms:**
```html
<form 
  id="mood-form" 
  aria-label="Mood Tracking Form"
  novalidate
  class="space-y-4"
>
  <label 
    for="mood-level" 
    class="block text-sm font-medium text-gray-700"
  >
    How are you feeling today?
    <span class="sr-only">Required field</span>
  </label>
  
  <input 
    type="range" 
    id="mood-level"
    name="moodLevel"
    min="1" 
    max="10" 
    value="5"
    aria-valuemin="1"
    aria-valuemax="10"
    aria-valuenow="5"
    aria-label="Mood level from 1 to 10"
    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
  >
  
  <textarea 
    id="mood-note"
    name="note"
    rows="4"
    placeholder="Optional: Share what's on your mind..."
    aria-label="Mood note"
    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
  ></textarea>
  
  <button 
    type="submit"
    aria-label="Save mood entry"
    class="btn-primary"
  >
    <span aria-hidden="true">💚</span>
    Save Mood
  </button>
</form>
```

**Accessibility Attributes:**
```html
<!-- Buttons -->
<button 
  aria-label="Toggle dark mode"
  aria-pressed="false"
  aria-live="polite"
  class="accessibility-toggle"
>
  <span aria-hidden="true">🌙</span>
  <span class="sr-only">Dark mode</span>
</button>

<!-- Images -->
<img 
  src="assets/images/calm-illustration.svg" 
  alt="Calming illustration of a peaceful landscape"
  role="img"
  loading="lazy"
>

<!-- Modals -->
<div 
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
  class="modal"
>
  <h2 id="modal-title">Crisis Support</h2>
  <p id="modal-description">You're not alone. Help is available.</p>
</div>

<!-- Loading States -->
<div 
  role="status"
  aria-live="polite"
  aria-busy="true"
  class="loading-spinner"
>
  <span class="sr-only">Loading...</span>
</div>

<!-- Alerts/Toasts -->
<div 
  role="alert"
  aria-live="assertive"
  class="toast toast-success"
>
  Mood saved successfully!
</div>
```

**Cards & Containers:**
```html
<article 
  class="card mood-card"
  tabindex="0"
  role="article"
  aria-labelledby="mood-card-title"
>
  <header class="card-header">
    <h3 id="mood-card-title" class="card-title">Today's Mood</h3>
    <time datetime="2024-01-15" class="text-sm text-gray-500">
      January 15, 2024
    </time>
  </header>
  <div class="card-body">
    <!-- Card content -->
  </div>
</article>
```

---

## CSS REQUIREMENTS (TAILWIND + CUSTOM)

### Color Palette (Calming Theme)
```css
:root {
  --primary-purple: #8B5CF6;
  --primary-teal: #14B8A6;
  --primary-lavender: #A78BFA;
  --background-light: #F9FAFB;
  --background-dark: #1F2937;
  --text-primary: #111827;
  --text-secondary: #6B7280;
  --success-green: #10B981;
  --warning-yellow: #F59E0B;
  --error-red: #EF4444;
  --border-color: #E5E7EB;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Custom CSS Classes
```css
/* Buttons */
.btn-primary {
  @apply px-6 py-3 bg-gradient-to-r from-purple-500 to-teal-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2;
}

.btn-secondary {
  @apply px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg border-2 border-purple-500 hover:bg-purple-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500;
}

/* Cards */
.card {
  @apply bg-white rounded-2xl shadow-md p-6 transition-all duration-300 hover:shadow-xl border border-gray-100;
}

.mood-card {
  @apply card bg-gradient-to-br from-purple-50 to-teal-50;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse-gentle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

.animate-pulse-gentle {
  animation: pulse-gentle 2s ease-in-out infinite;
}

/* Accessibility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  .card {
    @apply border-2 border-gray-800;
  }
}

/* Dark Mode */
[data-theme="dark"] {
  --background-light: #1F2937;
  --text-primary: #F9FAFB;
  --text-secondary: #D1D5DB;
}

/* Focus States */
*:focus-visible {
  outline: 2px solid var(--primary-purple);
  outline-offset: 2px;
}
```

---

## JAVASCRIPT REQUIREMENTS (MODULAR ARCHITECTURE)

### Module Structure
```javascript
// config.js
const API_BASE_URL = 'http://localhost:3000/api';
const TOKEN_KEY = 'mindnest_token';
const USER_KEY = 'mindnest_user';

// utils.js
export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);
export const setAuthToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const removeAuthToken = () => localStorage.removeItem(TOKEN_KEY);
export const getCurrentUser = () => JSON.parse(localStorage.getItem(USER_KEY) || '{}');

export const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Something went wrong');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const showToast = (message, type = 'success') => {
  // Toast notification implementation
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
```

### Error Handling Pattern
```javascript
try {
  const data = await apiCall('/mood', {
    method: 'POST',
    body: JSON.stringify(moodData)
  });
  showToast('Mood saved successfully!', 'success');
} catch (error) {
  showToast(error.message || 'Failed to save mood', 'error');
  console.error('Error:', error);
}
```

---

## DATABASE MODELS (MONGOOSE SCHEMAS)

### User Model
```javascript
{
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  dateOfBirth: { type: Date },
  profilePicture: { type: String },
  preferences: {
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
    highContrast: { type: Boolean, default: false },
    textToSpeech: { type: Boolean, default: false },
    notifications: { type: Boolean, default: true }
  },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date }
}
```

### Mood Model
```javascript
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  moodLevel: { type: Number, required: true, min: 1, max: 10 },
  emotion: { type: String, enum: ['happy', 'sad', 'anxious', 'angry', 'calm', 'tired', 'energetic', 'neutral'] },
  note: { type: String, maxlength: 500 },
  date: { type: Date, default: Date.now, required: true },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
}
```

### Journal Model
```javascript
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, maxlength: 100 },
  content: { type: String, required: true },
  mood: { type: String },
  tags: [{ type: String }],
  isEncrypted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

### Goal Model
```javascript
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, maxlength: 100 },
  description: { type: String, maxlength: 500 },
  type: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'daily' },
  status: { type: String, enum: ['pending', 'in-progress', 'completed', 'cancelled'], default: 'pending' },
  progress: { type: Number, min: 0, max: 100, default: 0 },
  targetDate: { type: Date },
  completedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
}
```

### Post Model (Community)
```javascript
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, maxlength: 1000 },
  isAnonymous: { type: Boolean, default: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true, maxlength: 500 },
    isAnonymous: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
  }],
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

### Reminder Model
```javascript
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['medication', 'therapy', 'exercise', 'custom'], required: true },
  title: { type: String, required: true },
  description: { type: String },
  time: { type: String, required: true }, // HH:MM format
  days: [{ type: Number, min: 0, max: 6 }], // 0 = Sunday, 6 = Saturday
  isActive: { type: Boolean, default: true },
  lastTriggered: { type: Date },
  createdAt: { type: Date, default: Date.now }
}
```

---

## FEATURE IMPLEMENTATION DETAILS

### 1. AUTHENTICATION SYSTEM

**Frontend (auth.js):**
- Signup form with validation (email, password strength, username)
- Login form with "Remember me" option
- Password visibility toggle
- Form validation feedback
- Redirect to dashboard on success
- Token storage in localStorage
- Auto-logout on token expiry

**Backend (auth.routes.js, auth.controller.js):**
- POST `/api/auth/signup` - User registration
- POST `/api/auth/login` - User login
- POST `/api/auth/logout` - Logout (optional)
- GET `/api/auth/me` - Get current user
- Password hashing with bcryptjs (10 rounds)
- JWT token generation (expires in 7 days)
- Input validation with express-validator

**HTML Form Example:**
```html
<form id="signup-form" aria-label="Sign up form" class="space-y-4">
  <div>
    <label for="username" class="block text-sm font-medium mb-1">
      Username <span class="text-red-500">*</span>
    </label>
    <input 
      type="text" 
      id="username" 
      name="username"
      required
      minlength="3"
      maxlength="20"
      pattern="[a-zA-Z0-9_]+"
      aria-describedby="username-error"
      class="input-field"
    >
    <span id="username-error" class="error-message" role="alert"></span>
  </div>
  
  <div>
    <label for="email" class="block text-sm font-medium mb-1">
      Email <span class="text-red-500">*</span>
    </label>
    <input 
      type="email" 
      id="email" 
      name="email"
      required
      aria-describedby="email-error"
      class="input-field"
    >
    <span id="email-error" class="error-message" role="alert"></span>
  </div>
  
  <div>
    <label for="password" class="block text-sm font-medium mb-1">
      Password <span class="text-red-500">*</span>
    </label>
    <div class="relative">
      <input 
        type="password" 
        id="password" 
        name="password"
        required
        minlength="6"
        aria-describedby="password-error password-strength"
        class="input-field pr-10"
      >
      <button 
        type="button"
        id="toggle-password"
        aria-label="Toggle password visibility"
        class="absolute right-3 top-1/2 transform -translate-y-1/2"
      >
        👁️
      </button>
    </div>
    <div id="password-strength" class="text-xs mt-1"></div>
    <span id="password-error" class="error-message" role="alert"></span>
  </div>
  
  <button type="submit" class="btn-primary w-full">
    Create Account
  </button>
</form>
```

### 2. DASHBOARD PAGE

**Features:**
- Personalized greeting ("Good morning, [Name]!")
- Today's mood card (quick entry)
- Weekly mood chart (Chart.js line graph)
- Recent journal entries (last 3)
- Active goals progress
- Motivational quote (API or static)
- Quick access buttons to all features
- Daily check-in reminder

**HTML Structure:**
```html
<main role="main" class="dashboard-container">
  <section aria-labelledby="greeting-heading" class="greeting-section">
    <h1 id="greeting-heading" class="text-3xl font-bold">
      Good <span id="time-of-day">morning</span>, <span id="user-name">User</span>!
    </h1>
    <p class="text-gray-600 mt-2">How are you feeling today?</p>
  </section>
  
  <section aria-labelledby="mood-summary" class="mood-summary-section">
    <h2 id="mood-summary" class="section-title">Your Mood This Week</h2>
    <div class="chart-container">
      <canvas id="mood-chart" role="img" aria-label="Weekly mood trend chart"></canvas>
    </div>
  </section>
  
  <section aria-labelledby="quick-actions" class="quick-actions-section">
    <h2 id="quick-actions" class="section-title">Quick Actions</h2>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <a href="mood.html" class="action-card" aria-label="Track your mood">
        <span class="text-4xl mb-2">😊</span>
        <span class="font-semibold">Track Mood</span>
      </a>
      <a href="journal.html" class="action-card" aria-label="Write in journal">
        <span class="text-4xl mb-2">📝</span>
        <span class="font-semibold">Journal</span>
      </a>
      <a href="goals.html" class="action-card" aria-label="View goals">
        <span class="text-4xl mb-2">🎯</span>
        <span class="font-semibold">Goals</span>
      </a>
      <a href="community.html" class="action-card" aria-label="Community support">
        <span class="text-4xl mb-2">💬</span>
        <span class="font-semibold">Community</span>
      </a>
    </div>
  </section>
  
  <section aria-labelledby="quote-section" class="quote-section">
    <blockquote id="quote-section" class="quote-card">
      <p class="quote-text" id="motivational-quote"></p>
      <footer class="quote-author">— MindNest</footer>
    </blockquote>
  </section>
</main>
```

**JavaScript (dashboard.js):**
```javascript
// Load user data
// Fetch weekly mood data
// Initialize Chart.js
// Load motivational quote
// Handle quick mood entry
```

### 3. MOOD TRACKING PAGE

**Features:**
- Emoji-based mood selector (8 emotions)
- Intensity slider (1-10)
- Optional note field
- Save to database
- View mood history (calendar view)
- Weekly/monthly trend charts
- Mood insights (patterns, triggers)

**HTML:**
```html
<main role="main" class="mood-tracking-page">
  <section aria-labelledby="mood-entry" class="mood-entry-section">
    <h1 id="mood-entry" class="page-title">How are you feeling?</h1>
    
    <form id="mood-form" aria-label="Mood tracking form" class="mood-form">
      <div class="mood-selector" role="group" aria-label="Select your mood">
        <button 
          type="button"
          class="mood-emoji-btn"
          data-mood="happy"
          data-level="8"
          aria-label="Happy"
          aria-pressed="false"
        >
          😊 Happy
        </button>
        <button 
          type="button"
          class="mood-emoji-btn"
          data-mood="sad"
          data-level="3"
          aria-label="Sad"
          aria-pressed="false"
        >
          😢 Sad
        </button>
        <!-- More mood buttons -->
      </div>
      
      <div class="intensity-slider-container">
        <label for="intensity" class="block text-sm font-medium mb-2">
          Intensity: <span id="intensity-value">5</span>/10
        </label>
        <input 
          type="range" 
          id="intensity"
          name="intensity"
          min="1" 
          max="10" 
          value="5"
          class="w-full h-3 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-lg appearance-none cursor-pointer"
          aria-valuemin="1"
          aria-valuemax="10"
          aria-valuenow="5"
        >
      </div>
      
      <div class="note-container">
        <label for="mood-note" class="block text-sm font-medium mb-2">
          What's on your mind? (Optional)
        </label>
        <textarea 
          id="mood-note"
          name="note"
          rows="4"
          placeholder="Share your thoughts..."
          maxlength="500"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          aria-describedby="note-char-count"
        ></textarea>
        <span id="note-char-count" class="text-xs text-gray-500">0/500 characters</span>
      </div>
      
      <button type="submit" class="btn-primary w-full mt-6">
        Save Mood Entry
      </button>
    </form>
  </section>
  
  <section aria-labelledby="mood-history" class="mood-history-section">
    <h2 id="mood-history" class="section-title">Your Mood History</h2>
    <div class="chart-container">
      <canvas id="mood-trend-chart"></canvas>
    </div>
    <div id="mood-calendar" class="mood-calendar" role="grid" aria-label="Mood calendar"></div>
  </section>
</main>
```

**JavaScript (mood.js):**
- Handle emoji selection
- Update intensity slider display
- Character counter for note
- Form submission with API call
- Load and display mood history
- Initialize Chart.js for trends
- Calendar view implementation

### 4. JOURNALING PAGE

**Features:**
- Rich text editor (or simple textarea)
- Date-based entries
- Search functionality
- Tags/categories
- Mood association
- Privacy indicator
- Export option (JSON/PDF)

**HTML:**
```html
<main role="main" class="journal-page">
  <section aria-labelledby="journal-entry" class="journal-entry-section">
    <h1 id="journal-entry" class="page-title">Your Private Journal</h1>
    
    <form id="journal-form" aria-label="Journal entry form" class="journal-form">
      <div class="journal-header">
        <input 
          type="text" 
          id="journal-title"
          name="title"
          placeholder="Entry title (optional)"
          maxlength="100"
          class="journal-title-input"
        >
        <div class="journal-meta">
          <time id="entry-date" datetime="" class="text-sm text-gray-500"></time>
          <span class="privacy-indicator" aria-label="Private entry">
            🔒 Private
          </span>
        </div>
      </div>
      
      <textarea 
        id="journal-content"
        name="content"
        rows="15"
        placeholder="Write your thoughts here... This is your safe space."
        required
        class="journal-textarea"
        aria-label="Journal entry content"
      ></textarea>
      
      <div class="journal-tags">
        <label for="journal-tags-input" class="block text-sm font-medium mb-2">
          Tags (optional)
        </label>
        <input 
          type="text" 
          id="journal-tags-input"
          placeholder="Add tags separated by commas"
          class="input-field"
        >
        <div id="tags-display" class="tags-container"></div>
      </div>
      
      <div class="journal-actions">
        <button type="submit" class="btn-primary">
          Save Entry
        </button>
        <button type="button" id="clear-journal" class="btn-secondary">
          Clear
        </button>
      </div>
    </form>
  </section>
  
  <section aria-labelledby="journal-list" class="journal-list-section">
    <h2 id="journal-list" class="section-title">Previous Entries</h2>
    <div class="journal-search">
      <input 
        type="search" 
        id="journal-search"
        placeholder="Search entries..."
        aria-label="Search journal entries"
        class="input-field"
      >
    </div>
    <div id="journal-entries-list" class="journal-entries-grid" role="list"></div>
  </section>
</main>
```

### 5. GOAL SETTING PAGE

**Features:**
- Create daily/weekly/monthly goals
- Progress tracking (0-100%)
- Goal categories
- Completion celebration
- Goal history
- Streak tracking

**HTML:**
```html
<main role="main" class="goals-page">
  <section aria-labelledby="create-goal" class="create-goal-section">
    <h1 id="create-goal" class="page-title">Set Your Goals</h1>
    
    <form id="goal-form" aria-label="Goal creation form" class="goal-form">
      <div>
        <label for="goal-title" class="block text-sm font-medium mb-1">
          Goal Title <span class="text-red-500">*</span>
        </label>
        <input 
          type="text" 
          id="goal-title"
          name="title"
          required
          maxlength="100"
          placeholder="e.g., Take a 10-minute walk"
          class="input-field"
        >
      </div>
      
      <div>
        <label for="goal-description" class="block text-sm font-medium mb-1">
          Description (optional)
        </label>
        <textarea 
          id="goal-description"
          name="description"
          rows="3"
          maxlength="500"
          placeholder="Add more details about your goal..."
          class="input-field"
        ></textarea>
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="goal-type" class="block text-sm font-medium mb-1">
            Goal Type
          </label>
          <select 
            id="goal-type"
            name="type"
            class="input-field"
            required
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        
        <div>
          <label for="target-date" class="block text-sm font-medium mb-1">
            Target Date
          </label>
          <input 
            type="date" 
            id="target-date"
            name="targetDate"
            class="input-field"
          >
        </div>
      </div>
      
      <button type="submit" class="btn-primary w-full">
        Create Goal
      </button>
    </form>
  </section>
  
  <section aria-labelledby="active-goals" class="goals-list-section">
    <h2 id="active-goals" class="section-title">Your Goals</h2>
    <div id="goals-container" class="goals-grid" role="list"></div>
  </section>
</main>
```

**Goal Card HTML:**
```html
<article class="goal-card" role="listitem">
  <header class="goal-card-header">
    <h3 class="goal-title">Take a 10-minute walk</h3>
    <span class="goal-type-badge">Daily</span>
  </header>
  
  <div class="goal-progress">
    <div class="progress-bar-container">
      <div 
        class="progress-bar" 
        role="progressbar"
        aria-valuenow="60"
        aria-valuemin="0"
        aria-valuemax="100"
        style="width: 60%"
      ></div>
    </div>
    <span class="progress-text">60% Complete</span>
  </div>
  
  <div class="goal-actions">
    <button 
      class="btn-update-progress"
      aria-label="Update progress"
    >
      Update Progress
    </button>
    <button 
      class="btn-complete-goal"
      aria-label="Mark as complete"
    >
      ✓ Complete
    </button>
  </div>
</article>
```

### 6. COPING STRATEGIES PAGE

**Features:**
- Breathing exercises (animated)
- Mindfulness exercises
- Grounding techniques (5-4-3-2-1)
- Progressive muscle relaxation
- Guided meditation scripts
- Audio playback (Web Speech API)

**HTML:**
```html
<main role="main" class="coping-strategies-page">
  <h1 class="page-title">Coping Strategies</h1>
  
  <section aria-labelledby="breathing-exercise" class="strategy-section">
    <h2 id="breathing-exercise" class="strategy-title">Breathing Exercise</h2>
    <div class="breathing-circle-container">
      <div 
        id="breathing-circle"
        class="breathing-circle"
        role="img"
        aria-label="Breathing animation"
      >
        <span id="breathing-instruction" class="breathing-text">Breathe In</span>
      </div>
    </div>
    <button id="start-breathing" class="btn-primary">
      Start Breathing Exercise
    </button>
  </section>
  
  <section aria-labelledby="grounding-technique" class="strategy-section">
    <h2 id="grounding-technique" class="strategy-title">5-4-3-2-1 Grounding Technique</h2>
    <div class="grounding-steps">
      <div class="grounding-step">
        <span class="step-number">5</span>
        <p class="step-description">Name 5 things you can see</p>
        <input type="text" class="grounding-input" placeholder="Type what you see...">
      </div>
      <!-- More steps -->
    </div>
  </section>
  
  <section aria-labelledby="mindfulness" class="strategy-section">
    <h2 id="mindfulness" class="strategy-title">Mindfulness Exercises</h2>
    <div class="mindfulness-cards">
      <article class="mindfulness-card">
        <h3>Body Scan</h3>
        <p>Progressive relaxation technique</p>
        <button class="btn-secondary">Start Exercise</button>
      </article>
      <!-- More cards -->
    </div>
  </section>
</main>
```

### 7. PEER SUPPORT COMMUNITY PAGE

**Features:**
- Anonymous posting
- Like/comment system
- Post filtering (recent, popular, my posts)
- Moderation-friendly UI
- Supportive emoji reactions
- Report inappropriate content

**HTML:**
```html
<main role="main" class="community-page">
  <h1 class="page-title">Community Support</h1>
  
  <section aria-labelledby="create-post" class="create-post-section">
    <h2 id="create-post" class="sr-only">Create a post</h2>
    <form id="post-form" aria-label="Create community post" class="post-form">
      <textarea 
        id="post-content"
        name="content"
        rows="4"
        placeholder="Share your thoughts... (Anonymous by default)"
        maxlength="1000"
        required
        class="input-field"
        aria-describedby="post-char-count"
      ></textarea>
      <div class="post-form-footer">
        <span id="post-char-count" class="text-xs text-gray-500">0/1000</span>
        <label class="checkbox-label">
          <input 
            type="checkbox" 
            id="anonymous-post"
            checked
            aria-label="Post anonymously"
          >
          <span>Post anonymously</span>
        </label>
        <button type="submit" class="btn-primary">
          Share
        </button>
      </div>
    </form>
  </section>
  
  <section aria-labelledby="posts-list" class="posts-section">
    <div class="posts-filter">
      <button 
        class="filter-btn active"
        data-filter="recent"
        aria-label="Show recent posts"
      >
        Recent
      </button>
      <button 
        class="filter-btn"
        data-filter="popular"
        aria-label="Show popular posts"
      >
        Popular
      </button>
      <button 
        class="filter-btn"
        data-filter="my-posts"
        aria-label="Show my posts"
      >
        My Posts
      </button>
    </div>
    
    <div id="posts-container" class="posts-container" role="list"></div>
  </section>
</main>
```

**Post Card HTML:**
```html
<article class="post-card" role="listitem">
  <header class="post-header">
    <div class="post-author">
      <span class="author-avatar">👤</span>
      <span class="author-name">Anonymous User</span>
      <time class="post-time" datetime="2024-01-15T10:30:00">2 hours ago</time>
    </div>
  </header>
  
  <div class="post-content">
    <p>Today was really tough, but I'm proud I got out of bed...</p>
  </div>
  
  <footer class="post-footer">
    <button 
      class="like-btn"
      aria-label="Like this post"
      aria-pressed="false"
    >
      <span class="like-icon">❤️</span>
      <span class="like-count">12</span>
    </button>
    <button 
      class="comment-btn"
      aria-label="Comment on this post"
    >
      💬 Comment
    </button>
    <button 
      class="report-btn"
      aria-label="Report inappropriate content"
    >
      ⚠️ Report
    </button>
  </footer>
  
  <div class="comments-section" aria-label="Comments">
    <!-- Comments will be loaded here -->
  </div>
</article>
```

### 8. PROFESSIONAL SUPPORT PAGE

**Features:**
- Crisis hotline buttons (prominent)
- Therapist directory (mock data)
- Emergency contact modal
- Resources for finding help
- Appointment booking (mock)

**HTML:**
```html
<main role="main" class="support-page">
  <section aria-labelledby="crisis-support" class="crisis-section">
    <h1 id="crisis-support" class="page-title">Need Immediate Help?</h1>
    <div class="crisis-buttons">
      <a 
        href="tel:988"
        class="crisis-btn crisis-primary"
        aria-label="Call 988 Suicide & Crisis Lifeline"
      >
        <span class="crisis-icon">📞</span>
        <div class="crisis-info">
          <strong>988 Suicide & Crisis Lifeline</strong>
          <span>Available 24/7</span>
        </div>
      </a>
      <a 
        href="tel:1-800-273-8255"
        class="crisis-btn"
        aria-label="Call National Suicide Prevention Lifeline"
      >
        <span class="crisis-icon">📞</span>
        <div class="crisis-info">
          <strong>1-800-273-8255</strong>
          <span>National Suicide Prevention</span>
        </div>
      </a>
    </div>
  </section>
  
  <section aria-labelledby="therapist-directory" class="therapist-section">
    <h2 id="therapist-directory" class="section-title">Find a Therapist</h2>
    <div id="therapist-list" class="therapist-grid" role="list"></div>
  </section>
  
  <section aria-labelledby="resources" class="resources-section">
    <h2 id="resources" class="section-title">Additional Resources</h2>
    <div class="resources-list">
      <article class="resource-card">
        <h3>National Alliance on Mental Illness (NAMI)</h3>
        <p>Support and advocacy organization</p>
        <a href="https://www.nami.org" target="_blank" rel="noopener" class="btn-secondary">
          Visit Website
        </a>
      </article>
      <!-- More resources -->
    </div>
  </section>
</main>
```

### 9. MEDICATION REMINDERS PAGE

**Features:**
- Create reminders (medication, therapy, exercise)
- Time-based scheduling
- Daily/weekly recurrence
- Browser notifications
- Email reminders (Nodemailer)
- Reminder history

**HTML:**
```html
<main role="main" class="reminders-page">
  <h1 class="page-title">Medication & Reminders</h1>
  
  <section aria-labelledby="create-reminder" class="create-reminder-section">
    <h2 id="create-reminder" class="section-title">Create Reminder</h2>
    
    <form id="reminder-form" aria-label="Create reminder form" class="reminder-form">
      <div>
        <label for="reminder-type" class="block text-sm font-medium mb-1">
          Reminder Type
        </label>
        <select id="reminder-type" name="type" class="input-field" required>
          <option value="medication">Medication</option>
          <option value="therapy">Therapy Session</option>
          <option value="exercise">Exercise</option>
          <option value="custom">Custom</option>
        </select>
      </div>
      
      <div>
        <label for="reminder-title" class="block text-sm font-medium mb-1">
          Title <span class="text-red-500">*</span>
        </label>
        <input 
          type="text" 
          id="reminder-title"
          name="title"
          required
          placeholder="e.g., Take antidepressant"
          class="input-field"
        >
      </div>
      
      <div>
        <label for="reminder-time" class="block text-sm font-medium mb-1">
          Time <span class="text-red-500">*</span>
        </label>
        <input 
          type="time" 
          id="reminder-time"
          name="time"
          required
          class="input-field"
        >
      </div>
      
      <div>
        <label class="block text-sm font-medium mb-2">Repeat Days</label>
        <div class="days-selector">
          <label class="day-checkbox">
            <input type="checkbox" name="days" value="0">
            <span>S</span>
          </label>
          <label class="day-checkbox">
            <input type="checkbox" name="days" value="1">
            <span>M</span>
          </label>
          <!-- More days -->
        </div>
      </div>
      
      <button type="submit" class="btn-primary w-full">
        Create Reminder
      </button>
    </form>
  </section>
  
  <section aria-labelledby="active-reminders" class="reminders-list-section">
    <h2 id="active-reminders" class="section-title">Active Reminders</h2>
    <div id="reminders-container" class="reminders-list" role="list"></div>
  </section>
</main>
```

**JavaScript (reminders.js):**
- Request notification permission
- Schedule browser notifications
- Check for due reminders
- Play notification sound
- Update reminder status

### 10. EDUCATIONAL RESOURCES PAGE

**Features:**
- Categorized articles
- Video content
- Read-time indicator
- Bookmark favorites
- Search functionality
- Reading progress

**HTML:**
```html
<main role="main" class="resources-page">
  <h1 class="page-title">Educational Resources</h1>
  
  <section aria-labelledby="resource-categories" class="categories-section">
    <h2 id="resource-categories" class="sr-only">Resource categories</h2>
    <div class="category-tabs" role="tablist">
      <button 
        class="category-tab active"
        role="tab"
        aria-selected="true"
        data-category="all"
      >
        All
      </button>
      <button 
        class="category-tab"
        role="tab"
        aria-selected="false"
        data-category="understanding"
      >
        Understanding Depression
      </button>
      <button 
        class="category-tab"
        role="tab"
        aria-selected="false"
        data-category="treatment"
      >
        Treatment Options
      </button>
      <!-- More categories -->
    </div>
  </section>
  
  <section aria-labelledby="resources-list" class="resources-list-section">
    <div class="resources-search">
      <input 
        type="search" 
        id="resources-search"
        placeholder="Search resources..."
        aria-label="Search educational resources"
        class="input-field"
      >
    </div>
    
    <div id="resources-container" class="resources-grid" role="list"></div>
  </section>
</main>
```

**Resource Card HTML:**
```html
<article class="resource-card" role="listitem">
  <div class="resource-image">
    <img src="assets/images/article-thumb.jpg" alt="Article thumbnail" loading="lazy">
    <span class="resource-type-badge">Article</span>
  </div>
  
  <div class="resource-content">
    <h3 class="resource-title">Understanding Depression: A Comprehensive Guide</h3>
    <p class="resource-excerpt">
      Learn about the symptoms, causes, and evidence-based treatments for depression...
    </p>
    <div class="resource-meta">
      <span class="read-time">⏱️ 5 min read</span>
      <span class="resource-category">Understanding Depression</span>
    </div>
    <div class="resource-actions">
      <a href="#" class="btn-secondary">Read More</a>
      <button class="bookmark-btn" aria-label="Bookmark this resource">
        🔖
      </button>
    </div>
  </div>
</article>
```

### 11. ACCESSIBILITY FEATURES

**accessibility.js:**
```javascript
// Dark mode toggle
// High contrast mode
// Text-to-speech
// Font size adjustment
// Keyboard navigation
// Screen reader announcements
```

**HTML Accessibility Toggle:**
```html
<div class="accessibility-panel" role="toolbar" aria-label="Accessibility options">
  <button 
    id="dark-mode-toggle"
    class="accessibility-btn"
    aria-label="Toggle dark mode"
    aria-pressed="false"
  >
    🌙 Dark Mode
  </button>
  
  <button 
    id="high-contrast-toggle"
    class="accessibility-btn"
    aria-label="Toggle high contrast mode"
    aria-pressed="false"
  >
    🎨 High Contrast
  </button>
  
  <button 
    id="text-to-speech-toggle"
    class="accessibility-btn"
    aria-label="Toggle text-to-speech"
    aria-pressed="false"
  >
    🔊 Text-to-Speech
  </button>
  
  <div class="font-size-control">
    <label for="font-size" class="sr-only">Font size</label>
    <input 
      type="range" 
      id="font-size"
      min="14"
      max="24"
      value="16"
      aria-label="Adjust font size"
    >
    <span id="font-size-value">16px</span>
  </div>
</div>
```

---

## BACKEND IMPLEMENTATION

### app.js (Express Setup)
```javascript
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../client')));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/mood', require('./routes/mood.routes'));
app.use('/api/journal', require('./routes/journal.routes'));
app.use('/api/goals', require('./routes/goals.routes'));
app.use('/api/community', require('./routes/community.routes'));
app.use('/api/resources', require('./routes/resources.routes'));
app.use('/api/reminders', require('./routes/reminders.routes'));
app.use('/api/user', require('./routes/user.routes'));

// Error handling middleware
app.use(require('./middleware/error.middleware'));

// Database connection
require('./config/db');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### auth.middleware.js
```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authenticate;
```

### Example Controller (mood.controller.js)
```javascript
const Mood = require('../models/Mood');

exports.createMood = async (req, res) => {
  try {
    const { moodLevel, emotion, note, tags } = req.body;
    
    const mood = new Mood({
      userId: req.user._id,
      moodLevel,
      emotion,
      note,
      tags,
      date: new Date()
    });
    
    await mood.save();
    res.status(201).json({ message: 'Mood saved successfully', mood });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMoods = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { userId: req.user._id };
    
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    
    const moods = await Mood.find(query).sort({ date: -1 });
    res.json(moods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

---

## ENVIRONMENT VARIABLES (.env)

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/mindnest
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

---

## PACKAGE.JSON DEPENDENCIES

```json
{
  "name": "mindnest",
  "version": "1.0.0",
  "description": "Mental Health Support App",
  "main": "server/app.js",
  "scripts": {
    "start": "node server/app.js",
    "dev": "nodemon server/app.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express-validator": "^7.0.1",
    "nodemailer": "^6.9.7"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

---

## UI/UX DESIGN GUIDELINES

### Color Psychology
- **Purple (#8B5CF6)**: Calm, wisdom, spirituality
- **Teal (#14B8A6)**: Tranquility, balance, healing
- **Lavender (#A78BFA)**: Serenity, peace
- **Soft grays**: Neutrality, professionalism

### Typography
- **Headings**: Inter or Poppins (Google Fonts)
- **Body**: Open Sans or Roboto
- **Sizes**: 16px base, responsive scaling
- **Line height**: 1.6 for readability

### Spacing
- Consistent 8px grid system
- Card padding: 24px
- Section spacing: 48px
- Mobile: Reduced by 50%

### Animations
- Smooth transitions (300ms)
- Gentle hover effects
- Loading states with spinners
- Success/error feedback

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

---

## TESTING CHECKLIST

- [ ] User registration/login
- [ ] Mood tracking save/retrieve
- [ ] Journal CRUD operations
- [ ] Goal creation and progress
- [ ] Community post creation
- [ ] Reminder notifications
- [ ] Accessibility features
- [ ] Mobile responsiveness
- [ ] Error handling
- [ ] API authentication

---

## README.md TEMPLATE

```markdown
# MindNest - Mental Health Support App

## Setup Instructions

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` file with required variables
4. Start MongoDB: `mongod`
5. Run server: `npm run dev`
6. Open `http://localhost:3000` in browser

## Features

- Mood Tracking
- Journaling
- Goal Setting
- Community Support
- Professional Resources
- Medication Reminders
- Educational Content
- Full Accessibility Support

## Tech Stack

- Frontend: HTML5, CSS3, JavaScript, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT
```

---

## FINAL NOTES FOR CURSOR

1. **Create all files** in the specified folder structure
2. **Implement all features** with full functionality
3. **Use semantic HTML** with proper ARIA attributes
4. **Apply Tailwind CSS** for styling with custom CSS for animations
5. **Implement proper error handling** throughout
6. **Add loading states** for all async operations
7. **Ensure mobile responsiveness** for all pages
8. **Include accessibility features** (dark mode, high contrast, text-to-speech)
9. **Add comments** in code for clarity
10. **Create a working application** that runs locally

**Start building the complete MindNest application now!**

