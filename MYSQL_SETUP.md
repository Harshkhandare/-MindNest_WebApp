# MySQL Setup Guide for MindNest

## ✅ Application Converted to MySQL!

The application has been successfully converted from MongoDB to MySQL.

---

## 🚀 Quick Setup (Choose One Option)

### Option 1: Local MySQL (Recommended for Development)

#### Step 1: Install MySQL
1. **Download MySQL:**
   - Go to https://dev.mysql.com/downloads/mysql/
   - Download MySQL Community Server for Windows
   - Run the installer

2. **During Installation:**
   - Choose "Developer Default" or "Server only"
   - Set root password (remember this!)
   - Complete the installation

3. **Verify Installation:**
   ```bash
   mysql --version
   ```

#### Step 2: Create Database
1. **Open MySQL Command Line or MySQL Workbench**

2. **Create Database:**
   ```sql
   CREATE DATABASE mindnest;
   ```

3. **Or use MySQL Workbench:**
   - Connect to MySQL server
   - Right-click → Create Schema
   - Name: `mindnest`
   - Click Apply

#### Step 3: Update .env File
The `.env` file has been updated with MySQL settings:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=mindnest
```

**Update the password:**
- Open `.env` file
- Replace `DB_PASSWORD=` with your MySQL root password:
  ```env
  DB_PASSWORD=your_actual_password
  ```

#### Step 4: Start MySQL Service
**Windows:**
```bash
# Check if MySQL is running
net start MySQL80

# Or start manually
net start MySQL
```

**Or use Services:**
- Press `Win + R`
- Type `services.msc`
- Find "MySQL80" or "MySQL"
- Right-click → Start

#### Step 5: Restart Server
```bash
npm run dev
```

You should see:
```
✅ MySQL Connected: localhost
✅ Database tables initialized
🚀 MindNest server running on port 3000
```

---

### Option 2: MySQL Cloud (AWS RDS, Azure, etc.)

1. **Create MySQL Database on Cloud Provider**
2. **Get Connection Details:**
   - Host
   - Port (usually 3306)
   - Username
   - Password
   - Database name

3. **Update .env:**
   ```env
   DB_HOST=your-cloud-host.com
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=mindnest
   DB_PORT=3306
   ```

---

## 📋 Database Tables Created Automatically

The application will automatically create these tables on first run:

- ✅ `users` - User accounts
- ✅ `moods` - Mood tracking entries
- ✅ `journals` - Journal entries
- ✅ `journal_tags` - Journal tags
- ✅ `goals` - User goals
- ✅ `posts` - Community posts
- ✅ `post_likes` - Post likes
- ✅ `post_comments` - Post comments
- ✅ `post_tags` - Post tags
- ✅ `mood_tags` - Mood tags
- ✅ `reminders` - Medication reminders
- ✅ `reminder_days` - Reminder schedule days

**No manual SQL scripts needed!** Tables are created automatically.

---

## 🧪 Test MySQL Connection

### Method 1: Test from Command Line
```bash
mysql -u root -p
# Enter your password
# Then run:
USE mindnest;
SHOW TABLES;
```

### Method 2: Test from Application
1. Start server: `npm run dev`
2. Check console for: `✅ MySQL Connected: localhost`
3. Try signup: http://localhost:3000/signup.html

---

## 🔧 Troubleshooting

### "Access denied for user 'root'@'localhost'"
**Solution:**
- Check your MySQL password in `.env`
- Reset MySQL root password if needed:
  ```sql
  ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
  ```

### "Can't connect to MySQL server"
**Solution:**
1. Check if MySQL service is running:
   ```bash
   net start MySQL80
   ```
2. Check MySQL port (default: 3306)
3. Verify firewall allows MySQL connections

### "Unknown database 'mindnest'"
**Solution:**
- Create the database manually:
  ```sql
  CREATE DATABASE mindnest;
  ```
- Or the app will create it automatically on first connection

### "Table already exists" errors
**Solution:**
- This is normal if tables already exist
- The app uses `CREATE TABLE IF NOT EXISTS`
- Safe to ignore

---

## 📝 .env File Configuration

Your `.env` file should have:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=mindnest
JWT_SECRET=mindnest-super-secret-jwt-key-change-in-production
NODE_ENV=development
```

**Important:** Replace `your_mysql_password_here` with your actual MySQL root password!

---

## ✅ Verification Checklist

After setup, verify:

- [ ] MySQL service is running
- [ ] Database `mindnest` exists
- [ ] `.env` file has correct MySQL credentials
- [ ] Server starts without errors
- [ ] Console shows: `✅ MySQL Connected`
- [ ] Can create account at http://localhost:3000/signup.html

---

## 🎯 Next Steps

1. **Start MySQL service**
2. **Update `.env` with your MySQL password**
3. **Start server:** `npm run dev`
4. **Create account:** http://localhost:3000/signup.html
5. **Start using MindNest!**

---

**Need Help?** Check server console for detailed error messages!



