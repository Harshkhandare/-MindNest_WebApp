# MindNest - Quick Start Guide

## 🚀 Quick Start (3 Steps)

### Step 1: Verify Setup
```bash
npm run verify
```

This will check:
- ✅ Environment variables (.env file)
- ✅ Dependencies installed
- ✅ All critical files present
- ✅ Database models configured
- ✅ API routes and controllers ready

### Step 2: Start MongoDB

**Option A: Local MongoDB**
- If MongoDB is installed as a service, it should start automatically
- Or start manually: `mongod --dbpath "C:\data\db"`

**Option B: MongoDB Atlas (Cloud)**
- No local installation needed
- Update `.env` with your Atlas connection string:
  ```
  MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mindnest
  ```

### Step 3: Start the Server
```bash
npm run dev
```

You should see:
```
🚀 MindNest server running on port 3000
📱 Open http://localhost:3000 in your browser
MongoDB Connected: localhost
```

## 🎯 First Time Setup

If you haven't set up yet:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Verify setup:**
   ```bash
   npm run verify
   ```

3. **Start MongoDB** (if using local installation)

4. **Start the server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   ```
   http://localhost:3000
   ```

## 📝 Create Your First Account

1. Click "Get Started" or "Sign Up"
2. Fill in:
   - Username (3-20 characters)
   - Email
   - Password (minimum 6 characters)
   - Optional: First Name, Last Name
3. Click "Create Account"
4. You'll be redirected to the dashboard

## ✨ Test the Features

### Mood Tracking
- Go to Dashboard → "Track Mood"
- Select an emotion
- Adjust intensity slider
- Add optional note
- Save your mood entry

### Journaling
- Click "Journal" in navigation
- Write your thoughts
- Add optional title and tags
- Save entry

### Goals
- Click "Goals" in navigation
- Create a new goal
- Set type (daily/weekly/monthly)
- Track your progress

### Community
- Click "Community" in navigation
- View posts from other users
- Create your own anonymous post
- Like and comment on posts

## 🐛 Troubleshooting

### "MongoDB connection error"
- **Solution:** Ensure MongoDB is running or update `.env` with Atlas connection string

### "Port 3000 already in use"
- **Solution:** Change `PORT` in `.env` to a different port (e.g., 3001)

### "Cannot find module"
- **Solution:** Run `npm install`

### "JWT_SECRET is not defined"
- **Solution:** Ensure `.env` file exists and contains `JWT_SECRET`

## 📚 More Information

- See `SETUP_GUIDE.md` for detailed setup instructions
- See `README.md` for full documentation
- Run `npm run verify` anytime to check your setup

---

**Ready?** Run `npm run dev` and start your mental health journey! 🧠💜



