# MindNest Setup Guide

## ✅ Completed Steps

1. **CSS Fixed** - Converted all `@apply` directives to regular CSS (Tailwind CDN compatible)
2. **Environment Variables** - Created `.env` file with required configuration
3. **Models Verified** - All database models are properly configured:
   - User
   - Mood
   - Journal
   - Goal
   - Post (Community)
   - Reminder

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ (✅ Detected: v24.11.1)
- MongoDB (local or MongoDB Atlas)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start MongoDB
**Option A: Local MongoDB**
```bash
# Windows (if MongoDB is installed as a service)
# MongoDB should start automatically

# Or start manually:
mongod --dbpath "C:\data\db"
```

**Option B: MongoDB Atlas**
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get your connection string
4. Update `.env` file:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mindnest
   ```

### Step 3: Start the Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

### Step 4: Open the Application
Navigate to: `http://localhost:3000`

## 📁 Project Structure

```
mindnest/
├── client/              # Frontend (HTML, CSS, JS)
│   ├── index.html       # Landing page
│   ├── login.html       # Login page
│   ├── signup.html      # Signup page
│   ├── dashboard.html   # Main dashboard
│   ├── mood.html        # Mood tracking
│   ├── journal.html     # Journaling
│   ├── goals.html       # Goal setting
│   ├── community.html   # Community support
│   ├── resources.html   # Educational resources
│   ├── reminders.html   # Medication reminders
│   ├── profile.html     # User profile
│   ├── css/
│   │   └── styles.css   # Custom styles
│   └── js/              # JavaScript modules
│
├── server/              # Backend (Node.js/Express)
│   ├── app.js          # Express app setup
│   ├── routes/         # API routes
│   ├── controllers/    # Route controllers
│   ├── models/         # MongoDB models
│   ├── middleware/     # Custom middleware
│   └── config/         # Configuration
│
├── .env                # Environment variables (created)
├── package.json        # Dependencies
└── README.md           # Project documentation
```

## 🔧 Environment Variables (.env)

The following variables are configured in `.env`:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/mindnest
JWT_SECRET=mindnest-super-secret-jwt-key-change-in-production
NODE_ENV=development
```

**⚠️ Important:** Change `JWT_SECRET` to a secure random string in production!

## 🧪 Testing the Setup

### 1. Test Server Startup
```bash
npm start
```

Expected output:
```
🚀 MindNest server running on port 3000
📱 Open http://localhost:3000 in your browser
MongoDB Connected: localhost
```

### 2. Test Database Connection
If MongoDB is not running, you'll see:
```
Database connection error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:** Start MongoDB or update `MONGODB_URI` in `.env` to use MongoDB Atlas.

### 3. Test Application
1. Open `http://localhost:3000`
2. Click "Get Started" or "Sign Up"
3. Create a new account
4. Login and explore the dashboard

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (requires auth)

### Mood Tracking
- `POST /api/mood` - Create mood entry
- `GET /api/mood` - Get mood entries
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
- `GET /api/community` - Get posts
- `GET /api/community/:id` - Get specific post
- `POST /api/community/:id/like` - Like/unlike post
- `POST /api/community/:id/comment` - Add comment
- `DELETE /api/community/:id` - Delete post

### Reminders
- `POST /api/reminders` - Create reminder
- `GET /api/reminders` - Get reminders
- `GET /api/reminders/:id` - Get specific reminder
- `PUT /api/reminders/:id` - Update reminder
- `DELETE /api/reminders/:id` - Delete reminder

## 🐛 Troubleshooting

### Issue: "Cannot find module"
**Solution:** Run `npm install` to install dependencies

### Issue: "MongoDB connection error"
**Solutions:**
1. Ensure MongoDB is running locally
2. Or update `.env` with MongoDB Atlas connection string
3. Check MongoDB service status

### Issue: "Port 3000 already in use"
**Solution:** Change `PORT` in `.env` to a different port (e.g., 3001)

### Issue: CSS not loading properly
**Solution:** Ensure Tailwind CDN is loaded in HTML files (already configured)

### Issue: "JWT_SECRET is not defined"
**Solution:** Ensure `.env` file exists and contains `JWT_SECRET`

## ✨ Features Implemented

- ✅ User authentication (signup/login)
- ✅ Mood tracking with charts
- ✅ Private journaling
- ✅ Goal setting and tracking
- ✅ Community support (anonymous posts)
- ✅ Medication reminders
- ✅ Educational resources
- ✅ Accessibility features (dark mode, text-to-speech)
- ✅ Responsive design
- ✅ Error handling
- ✅ Input validation

## 🎯 Next Steps

1. **Start MongoDB** (if using local installation)
2. **Run the server**: `npm run dev`
3. **Test the application** in your browser
4. **Create your first account** and explore features

## 📚 Additional Resources

- [MongoDB Installation Guide](https://docs.mongodb.com/manual/installation/)
- [MongoDB Atlas Setup](https://www.mongodb.com/cloud/atlas/register)
- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)

---

**Ready to start?** Run `npm run dev` and open `http://localhost:3000`! 🚀



