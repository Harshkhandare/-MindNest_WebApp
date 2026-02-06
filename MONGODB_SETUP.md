# MongoDB Setup Guide for MindNest

## Quick Setup Options

### Option 1: MongoDB Atlas (Cloud - Recommended) ⭐

**Easiest and fastest way to get started:**

1. **Create Free Account:**
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Sign up for free (no credit card required)

2. **Create a Cluster:**
   - Click "Build a Database"
   - Choose FREE tier (M0 Sandbox)
   - Select a cloud provider and region
   - Click "Create"

3. **Create Database User:**
   - Go to "Database Access" → "Add New Database User"
   - Choose "Password" authentication
   - Username: `mindnest` (or your choice)
   - Password: Create a strong password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Whitelist IP Address:**
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP address
   - Click "Confirm"

5. **Get Connection String:**
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://username:password@cluster.mongodb.net/`

6. **Update .env File:**
   ```env
   MONGODB_URI=mongodb+srv://mindnest:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/mindnest?retryWrites=true&w=majority
   ```
   Replace `YOUR_PASSWORD` with the password you created

7. **Restart Server:**
   ```bash
   npm run dev
   ```

---

### Option 2: Local MongoDB Installation

**For Windows:**

1. **Download MongoDB:**
   - Go to https://www.mongodb.com/try/download/community
   - Select Windows, MSI package
   - Download and install

2. **Install MongoDB:**
   - Run the installer
   - Choose "Complete" installation
   - Install as Windows Service (recommended)
   - Install MongoDB Compass (GUI tool)

3. **Start MongoDB:**
   - MongoDB should start automatically as a service
   - Or manually: Open Command Prompt as Admin and run:
     ```bash
     net start MongoDB
     ```

4. **Verify Installation:**
   - Open MongoDB Compass
   - Connect to: `mongodb://localhost:27017`
   - Should connect successfully

5. **Update .env (if needed):**
   ```env
   MONGODB_URI=mongodb://localhost:27017/mindnest
   ```
   (This is already the default)

6. **Restart Server:**
   ```bash
   npm run dev
   ```

---

## Verify MongoDB Connection

After setting up MongoDB, verify the connection:

1. **Check Server Logs:**
   When you start the server, you should see:
   ```
   ✅ MongoDB Connected: localhost
   ```
   or
   ```
   ✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
   ```

2. **Test API:**
   ```bash
   # Test signup (should work now)
   curl -X POST http://localhost:3000/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser","email":"test@test.com","password":"test123"}'
   ```

3. **Check Browser:**
   - Go to http://localhost:3000/signup.html
   - Fill in the form
   - Click "Create Account"
   - Should redirect to dashboard on success

---

## Troubleshooting

### "Database not connected" Error

**Symptoms:**
- Signup/Login shows "Database not connected" error
- Server logs show MongoDB connection error

**Solutions:**

1. **Check MongoDB is Running:**
   ```bash
   # Windows
   net start MongoDB
   
   # Or check services
   services.msc
   ```

2. **Check Connection String:**
   - Verify `.env` file has correct `MONGODB_URI`
   - For Atlas: Make sure password is URL-encoded (replace special chars with % encoding)
   - For local: Make sure MongoDB service is running

3. **Test Connection:**
   ```bash
   # Using MongoDB Compass
   mongodb://localhost:27017
   
   # Or using mongo shell
   mongo mongodb://localhost:27017/mindnest
   ```

4. **Check Firewall:**
   - Make sure port 27017 is not blocked (for local MongoDB)
   - For Atlas: Make sure your IP is whitelisted

### "Invalid credentials" Error

**This is normal if:**
- User doesn't exist (for login)
- Wrong password
- Database is connected but user not found

**Solution:**
- Create an account first using signup
- Make sure you're using the correct email/password

### Server Won't Start

**Check:**
1. Port 3000 is not in use:
   ```bash
   netstat -ano | findstr :3000
   ```

2. Node.js is installed:
   ```bash
   node --version
   ```

3. Dependencies are installed:
   ```bash
   npm install
   ```

---

## Quick Start Commands

```bash
# 1. Install dependencies (if not done)
npm install

# 2. Set up MongoDB (choose one):
#    - Option A: Use MongoDB Atlas (see above)
#    - Option B: Install local MongoDB (see above)

# 3. Update .env file with MongoDB URI

# 4. Start server
npm run dev

# 5. Open browser
# http://localhost:3000
```

---

## MongoDB Atlas Free Tier Limits

- **Storage:** 512 MB (plenty for development)
- **RAM:** Shared
- **No credit card required**
- **Perfect for:** Development, testing, small projects

---

## Next Steps After MongoDB Setup

1. ✅ MongoDB connected
2. ✅ Server running
3. ✅ Create your first account at http://localhost:3000/signup.html
4. ✅ Login and explore all features:
   - Mood Tracking
   - Journaling
   - Goals
   - Community
   - Resources
   - Reminders

---

**Need Help?** Check the server console for detailed error messages!



