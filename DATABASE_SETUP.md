# Database Setup Guide - MindNest

## 🔧 Quick Database Setup

### Option 1: Automated Setup (Recommended) ⭐

Run the provided batch file:
```bash
setup-and-run.bat
```

This will:
1. Prompt for MySQL root password
2. Create the database
3. Create the user
4. Grant privileges
5. Start the server

---

### Option 2: Manual MySQL Setup

#### Step 1: Connect to MySQL as root
```bash
mysql -u root -p
```

#### Step 2: Run these SQL commands
```sql
-- Create database
CREATE DATABASE IF NOT EXISTS mindnest CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user
CREATE USER IF NOT EXISTS 'Harshkant'@'localhost' IDENTIFIED BY 'Harsh@9712';

-- Grant privileges
GRANT ALL PRIVILEGES ON mindnest.* TO 'Harshkant'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;

-- Verify
SHOW DATABASES;
SELECT User, Host FROM mysql.user WHERE User = 'Harshkant';
```

#### Step 3: Verify Connection
```sql
-- Test connection as new user
mysql -u Harshkant -p'Harsh@9712' mindnest

-- Should connect successfully
```

---

### Option 3: Using .env File

Create a `.env` file in the project root:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=Harshkant
DB_PASSWORD=Harsh@9712
DB_NAME=mindnest

# Optional: For automatic setup
MYSQL_ROOT_PASSWORD=your_root_password_here
```

---

## 🔍 Troubleshooting

### Issue: "Access denied for user"
**Solution:**
1. Verify user exists: `SELECT User FROM mysql.user WHERE User = 'Harshkant';`
2. If not, create user (see Option 2)
3. Verify password is correct
4. Check user privileges: `SHOW GRANTS FOR 'Harshkant'@'localhost';`

### Issue: "Unknown database"
**Solution:**
1. Create database: `CREATE DATABASE mindnest;`
2. Or run the setup script

### Issue: "ECONNREFUSED" or "Cannot connect"
**Solution:**
1. Check if MySQL is running:
   ```bash
   # Windows
   net start MySQL80
   
   # Check service status
   Get-Service MySQL*
   ```

2. Verify MySQL is listening on port 3306:
   ```bash
   netstat -an | findstr 3306
   ```

3. Check MySQL configuration file (my.ini or my.cnf)

### Issue: "Connection timeout"
**Solution:**
1. Check firewall settings
2. Verify MySQL is accepting connections
3. Check if MySQL is bound to localhost (127.0.0.1)

---

## ✅ Verification

After setup, the server should show:
```
✅ MySQL Connected: localhost
✅ Database: mindnest
✅ User: Harshkant
✅ Database tables initialized
```

---

## 📝 Default Credentials

- **Database Name:** mindnest
- **Username:** Harshkant
- **Password:** Harsh@9712
- **Host:** localhost
- **Port:** 3306 (default)

---

## 🔒 Security Note

For production, change the default password and use environment variables!

