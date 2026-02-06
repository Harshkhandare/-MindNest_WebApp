# Quick Fix for MySQL Access Denied Error

## The Problem
Error: `Access denied for user 'root'@'localhost' (using password: NO)`

This happens because MySQL root requires a password, but the app is trying to connect without one.

## The Solution (Choose One)

### ✅ EASIEST: Double-Click Setup File

1. **Double-click:** `setup-and-run.bat`
2. **Enter your MySQL root password** when prompted
3. **Done!** The server will start automatically

---

### Option 2: Manual Setup

1. **Open MySQL Command Line:**
   ```bash
   mysql -u root -p
   ```

2. **Enter your root password**

3. **Run these commands:**
   ```sql
   CREATE DATABASE IF NOT EXISTS mindnest;
   CREATE USER IF NOT EXISTS 'Harshkant'@'localhost' IDENTIFIED BY 'Harsh@9712';
   GRANT ALL PRIVILEGES ON mindnest.* TO 'Harshkant'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

4. **Start server:**
   ```bash
   npm run dev
   ```

---

### Option 3: Use MySQL Workbench

1. Open MySQL Workbench
2. Connect as root
3. Open `setup-mysql.sql`
4. Execute the script (Ctrl+Shift+Enter)
5. Start server: `npm run dev`

---

## After Setup

The server will automatically:
- ✅ Connect using Harshkant user
- ✅ Create all database tables
- ✅ Start on http://localhost:3000

## Verify It Works

Open browser: http://localhost:3000

You should see the MindNest landing page!


