# ✅ MySQL User Setup - Harshkant

## 🎉 Configuration Updated!

I've updated your `.env` file with:
- **Username:** `Harshkant`
- **Password:** `Harsh@9712`
- **Database:** `mindnest`

---

## 📋 Next Step: Create MySQL User

You need to create the MySQL user in your database. Choose one method:

### Method 1: Automated Script (Easiest)

1. **Run the setup script:**
   ```powershell
   powershell -ExecutionPolicy Bypass -File setup-mysql-user.ps1
   ```

2. **Enter your MySQL root password** when prompted

3. **Done!** The script will create everything automatically.

---

### Method 2: Manual SQL (If script doesn't work)

1. **Open MySQL Command Line or MySQL Workbench**

2. **Login as root:**
   ```bash
   mysql -u root -p
   ```
   (Enter your MySQL root password)

3. **Run these commands:**
   ```sql
   CREATE DATABASE IF NOT EXISTS mindnest;
   CREATE USER IF NOT EXISTS 'Harshkant'@'localhost' IDENTIFIED BY 'Harsh@9712';
   GRANT ALL PRIVILEGES ON mindnest.* TO 'Harshkant'@'localhost';
   FLUSH PRIVILEGES;
   ```

4. **Verify user created:**
   ```sql
   SELECT User, Host FROM mysql.user WHERE User = 'Harshkant';
   ```

5. **Exit:**
   ```sql
   EXIT;
   ```

---

### Method 3: Use SQL File

1. **Open MySQL Command Line:**
   ```bash
   mysql -u root -p
   ```

2. **Run the SQL file:**
   ```sql
   SOURCE create-mysql-user.sql;
   ```
   
   Or copy-paste the contents of `create-mysql-user.sql`

---

## ✅ Verify Setup

After creating the user, test the connection:

```powershell
mysql -u Harshkant -p"Harsh@9712" -e "SELECT 'Connection successful!' AS Status;"
```

If you see "Connection successful!", you're all set!

---

## 🚀 Start Server

Once the user is created:

1. **Restart the server:**
   ```powershell
   npm run dev
   ```

2. **Check console for:**
   ```
   ✅ MySQL Connected: localhost
   ✅ Database tables initialized
   🚀 MindNest server running on port 3000
   ```

3. **Test signup:**
   - Go to: http://localhost:3000/signup.html
   - Create an account
   - Should work perfectly!

---

## 📝 Current Configuration

Your `.env` file now has:
```env
DB_HOST=localhost
DB_USER=Harshkant
DB_PASSWORD=Harsh@9712
DB_NAME=mindnest
```

---

## 🔧 Troubleshooting

### "Access denied for user 'Harshkant'"
- User doesn't exist yet - create it using one of the methods above

### "Unknown database 'mindnest'"
- Database will be created automatically, or create it manually:
  ```sql
  CREATE DATABASE mindnest;
  ```

### "Can't connect to MySQL server"
- Check if MySQL service is running:
  ```powershell
  Get-Service MySQL80
  ```
- Start it if needed:
  ```powershell
  Start-Service MySQL80
  ```

---

## ✨ Summary

- ✅ `.env` file updated with Harshkant credentials
- ⏳ **Need to create MySQL user** (choose method above)
- ✅ Database will be created automatically
- ✅ All tables will be created automatically

**Just create the user and you're ready to go!** 🎉



