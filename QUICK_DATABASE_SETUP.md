# Quick Database Setup Guide

## 🚀 Fastest Way to Set Up Database

### Option 1: Use the Batch File (Easiest) ⭐

1. **Double-click** `setup-and-run.bat`
2. Enter your MySQL root password when prompted
3. The script will:
   - Create the database
   - Create the user
   - Grant privileges
   - Start the server

### Option 2: Manual MySQL Commands

1. Open Command Prompt or PowerShell
2. Connect to MySQL:
   ```bash
   mysql -u root -p
   ```
3. Enter your root password
4. Run these commands:
   ```sql
   CREATE DATABASE IF NOT EXISTS mindnest CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER IF NOT EXISTS 'Harshkant'@'localhost' IDENTIFIED BY 'Harsh@9712';
   GRANT ALL PRIVILEGES ON mindnest.* TO 'Harshkant'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

### Option 3: Interactive Setup Script

```bash
npm run setup-db
```

Then enter your MySQL root password when prompted.

---

## ✅ Verify Setup

After setup, test the connection:

```bash
npm run test-db
```

You should see:
```
✅ Connection successful!
✅ Connected to database: mindnest
✅ Connected as user: Harshkant
```

---

## 🚀 Start the Server

Once database is set up:

```bash
npm run dev
```

The server will start on http://localhost:3000

---

## 🔧 Troubleshooting

### MySQL Not Running
```bash
# Windows
net start MySQL80
# or
net start MySQL
```

### Check MySQL Service
```powershell
Get-Service MySQL*
```

### Test MySQL Connection
```bash
mysql -u root -p
```

---

## 📝 Default Credentials

- **Database:** mindnest
- **User:** Harshkant  
- **Password:** Harsh@9712
- **Host:** localhost
- **Port:** 3306

