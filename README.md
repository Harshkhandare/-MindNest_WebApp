# MindNest - Mental Health Support Web App

**Tagline:** You're not alone. One step at a time.

A professional, production-ready full-stack mental health support application focused on depression support with real backend logic, database integration, authentication, analytics, and polished UI inspired by apps like Headspace and Calm.

## 🎯 Features

### 1. Authentication
- ✅ User signup and login
- ✅ Password hashing with bcryptjs
- ✅ JWT protected routes
- ✅ Session management with HttpOnly cookies

### 2. Dashboard
- ✅ Personalized daily greeting
- ✅ Mood summary with Chart.js visualization
- ✅ Progress overview (goals, journals)
- ✅ Motivational quotes

### 3. Mood Tracking
- ✅ Emoji-based mood selection (8 emotions)
- ✅ Intensity slider (1-10 scale)
- ✅ Optional notes input
- ✅ Save to database
- ✅ Chart.js line graph (weekly/monthly trends)
- ✅ Mood history view

### 4. Journaling
- ✅ Secure private journal
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Date-based entries
- ✅ Search functionality
- ✅ Encrypted storage simulation

### 5. Goal Setting
- ✅ Create daily/weekly/monthly goals
- ✅ Progress tracking with visual progress bar
- ✅ Completion status management
- ✅ Goal editing and deletion

### 6. Coping Strategies
- ✅ Breathing exercises with visual guides
- ✅ 5-4-3-2-1 Grounding technique
- ✅ Mindfulness exercises
- ✅ Body scan, progressive muscle relaxation
- ✅ Guided meditation and visualization

### 7. Peer Support Community
- ✅ Anonymous posts (no real names shown)
- ✅ Like & comment functionality
- ✅ Moderation-friendly UI
- ✅ Filter by Recent/Popular/My Posts
- ✅ Supportive community environment

### 8. Professional Support
- ✅ Crisis hotline buttons
- ✅ Emergency modal with resources
- ✅ Support resources section

### 9. Medication Reminders
- ✅ Time-based reminders
- ✅ Browser notifications (Web Notifications API)
- ✅ Email fallback ready (Nodemailer configured)
- ✅ Day-of-week scheduling
- ✅ Active/inactive toggle

### 10. Educational Resources
- ✅ Articles and videos
- ✅ Categorized content
- ✅ Read-time indicator
- ✅ Search functionality

### 11. Accessibility
- ✅ Dark/light mode toggle
- ✅ High contrast mode
- ✅ ARIA labels throughout
- ✅ Text-to-Speech using Web Speech API
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Semantic HTML5

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic tags (header, main, section, article)
- **Tailwind CSS** - Utility-first CSS framework
- **Vanilla JavaScript** - ES6+ modules, no frameworks
- **Chart.js** - Mood analytics and visualizations
- **Web APIs** - Notifications, Speech Synthesis

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Relational database (with MongoDB-ready structure)
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Nodemailer** - Email notifications (configured)
- **node-cron** - Scheduled tasks for reminders

### Design
- **Soft color palette** - Lavender, teal, white
- **Rounded cards** - Modern UI components
- **Smooth transitions** - CSS animations
- **Mobile responsive** - Tailwind responsive classes
- **Professional typography** - System font stack

## 📁 Project Structure

```
mindnest/
│
├── client/                    # Frontend files
│   ├── index.html            # Landing page
│   ├── login.html            # Login page
│   ├── signup.html          # Signup page
│   ├── dashboard.html        # Main dashboard
│   ├── mood.html            # Mood tracking
│   ├── journal.html         # Journaling
│   ├── goals.html           # Goal setting
│   ├── community.html       # Peer support
│   ├── coping.html          # Coping strategies
│   ├── resources.html       # Educational resources
│   ├── reminders.html       # Medication reminders
│   ├── profile.html         # User profile
│   ├── css/
│   │   └── styles.css       # Custom styles
│   └── js/
│       ├── config.js        # API configuration
│       ├── utils.js         # Utility functions
│       ├── validation.js    # Form validation
│       ├── auth.js          # Authentication
│       ├── dashboard.js     # Dashboard logic
│       ├── mood.js          # Mood tracking
│       ├── journal.js       # Journaling
│       ├── goals.js         # Goal management
│       ├── community.js     # Community features
│       ├── coping.js        # Coping strategies
│       ├── resources.js     # Resources
│       ├── reminders.js     # Reminders
│       ├── profile.js       # Profile management
│       └── accessibility.js # Accessibility features
│
├── server/                   # Backend files
│   ├── app.js              # Express app setup
│   ├── routes/              # API routes
│   │   ├── auth.routes.js
│   │   ├── mood.routes.js
│   │   ├── journal.routes.js
│   │   ├── goals.routes.js
│   │   ├── community.routes.js
│   │   ├── resources.routes.js
│   │   ├── reminders.routes.js
│   │   └── user.routes.js
│   ├── controllers/         # Route controllers
│   │   ├── auth.controller.js
│   │   ├── mood.controller.js
│   │   ├── journal.controller.js
│   │   ├── goals.controller.js
│   │   ├── community.controller.js
│   │   ├── resources.controller.js
│   │   ├── reminders.controller.js
│   │   └── user.controller.js
│   ├── models/             # Database models
│   │   ├── User.js
│   │   ├── Mood.js
│   │   ├── Journal.js
│   │   ├── Goal.js
│   │   └── Post.js
│   ├── middleware/         # Custom middleware
│   │   ├── auth.middleware.js
│   │   └── error.middleware.js
│   ├── validators/         # Input validation
│   │   ├── auth.validator.js
│   │   ├── mood.validator.js
│   │   └── ...
│   ├── services/           # Business logic
│   │   └── reminder-scheduler.service.js
│   └── config/
│       └── db.js           # Database configuration
│
├── package.json            # Dependencies
├── .env                    # Environment variables
└── README.md              # This file
```

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** (v18 or higher)
- **MySQL** (v8.0 or higher) or MySQL-compatible database
- **npm** or **yarn**

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd "D:\Hackthone Project"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=Harshkant
   DB_PASSWORD=Harsh@9712
   DB_NAME=mindnest
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   
   # Optional: Email configuration for reminders
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

4. **Set up MySQL Database**
   
   The app will automatically create the database and tables on first run. Alternatively, you can run:
   ```bash
   npm run setup-db
   ```
   
   Or use the automated setup:
   ```bash
   setup-and-run.bat
   ```

5. **Start the server**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

6. **Open the application**
   - Navigate to `http://localhost:3000` in your browser
   - Sign up for a new account
   - Start using MindNest!

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Mood Tracking
- `POST /api/mood` - Create mood entry
- `GET /api/mood` - Get mood entries (with filters)
- `GET /api/mood/stats` - Get mood statistics
- `GET /api/mood/:id` - Get specific mood entry
- `PUT /api/mood/:id` - Update mood entry
- `DELETE /api/mood/:id` - Delete mood entry

### Journaling
- `POST /api/journal` - Create journal entry
- `GET /api/journal` - Get journal entries
- `GET /api/journal/:id` - Get specific entry
- `PUT /api/journal/:id` - Update entry
- `DELETE /api/journal/:id` - Delete entry

### Goals
- `POST /api/goals` - Create goal
- `GET /api/goals` - Get goals
- `GET /api/goals/:id` - Get specific goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

### Community
- `POST /api/community` - Create post
- `GET /api/community` - Get posts (with filters)
- `GET /api/community/:id` - Get specific post
- `POST /api/community/:id/like` - Like/unlike post
- `POST /api/community/:id/comment` - Add comment
- `DELETE /api/community/:id` - Delete post

### Resources
- `GET /api/resources` - Get resources
- `GET /api/resources/:id` - Get specific resource
- `GET /api/resources/categories` - Get categories

### Reminders
- `POST /api/reminders` - Create reminder
- `GET /api/reminders` - Get reminders
- `GET /api/reminders/:id` - Get specific reminder
- `PUT /api/reminders/:id` - Update reminder
- `DELETE /api/reminders/:id` - Delete reminder

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `PUT /api/user/preferences` - Update preferences

## 🎨 UI Requirements

### Color Palette
- **Primary**: Lavender (#8B5CF6)
- **Secondary**: Teal (#14B8A6)
- **Background**: White/Light Gray
- **Text**: Dark Gray (#1F2937)
- **Accents**: Soft pastels

### Components
- Rounded cards with subtle shadows
- Smooth transitions (200-300ms)
- Consistent spacing (Tailwind spacing scale)
- Professional typography
- Accessible contrast ratios (WCAG AA)

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly buttons (min 44x44px)
- Readable text sizes

## ♿ Accessibility Features

### Dark Mode
- Toggle between light and dark themes
- Persists in localStorage
- System preference detection

### High Contrast
- Enhanced visibility mode
- Increased contrast ratios
- Better focus indicators

### Text-to-Speech
- Web Speech API integration
- Read content aloud
- Adjustable speech rate

### Keyboard Navigation
- Full keyboard accessibility
- Tab order management
- Focus indicators
- Skip links

### Screen Reader Support
- ARIA labels and roles
- Semantic HTML5
- Alt text for images
- Form labels

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **HttpOnly Cookies**: XSS protection
- **Input Validation**: Server-side validation
- **SQL Injection Protection**: Parameterized queries
- **CORS Configuration**: Restricted origins
- **Error Handling**: No sensitive data in errors

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Mood tracking with chart visualization
- [ ] Journal CRUD operations
- [ ] Goal creation and progress tracking
- [ ] Community post creation and interaction
- [ ] Reminder creation and notifications
- [ ] Dark mode toggle
- [ ] High contrast mode
- [ ] Text-to-speech functionality
- [ ] Mobile responsiveness

## 🚨 Crisis Support

If you're in crisis, please contact:
- **988 Suicide & Crisis Lifeline** (US): 988
- **National Suicide Prevention Lifeline**: 1-800-273-8255
- **Crisis Text Line**: Text HOME to 741741
- Your local emergency services: 911

## 📝 License

MIT License

## 🤝 Contributing

This is a hackathon project built for mental health awareness. Feel free to extend and improve it!

## 🙏 Acknowledgments

- Inspired by Headspace and Calm
- Built with empathy and care for mental health
- Designed for accessibility and inclusivity

---

**Built with ❤️ for mental health awareness**

**Remember: You're not alone. One step at a time.**
