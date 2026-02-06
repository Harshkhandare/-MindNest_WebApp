# MySQL User Setup Instructions

## Quick Setup

You need to create the MySQL user `Harshkant` with password `Harsh@9712` and the `mindnest` database.

### Option 1: PowerShell Script (Easiest)

1. Open PowerShell in this directory
2. Run:
   ```powershell
   powershell -ExecutionPolicy Bypass -File setup-user.ps1
   ```
3. Enter your MySQL root password when prompted

### Option 2: MySQL Command Line

1. Open Command Prompt
2. Run:
   ```bash
   mysql -u root -p
   ```
3. Enter your MySQL root password
4. Copy and paste these commands:
   ```sql
   CREATE DATABASE IF NOT EXISTS mindnest;
   CREATE USER IF NOT EXISTS 'Harshkant'@'localhost' IDENTIFIED BY 'Harsh@9712';
   GRANT ALL PRIVILEGES ON mindnest.* TO 'Harshkant'@'localhost';
   FLUSH PRIVILEGES;
   ```

### Option 3: MySQL Workbench

1. Open MySQL Workbench
2. Connect as root user
3. Open the file `setup-mysql.sql`
4. Execute the script (Ctrl+Shift+Enter)

### Option 4: Direct SQL File

Run this command in Command Prompt:
```bash
mysql -u root -p < setup-mysql.sql
```

## Verify Setup

After creating the user, test the connection:
```bash
npm run dev
```

You should see:
- ✅ MySQL Connected: localhost
- ✅ Database tables initialized

## Troubleshooting

If you get "Access denied" errors:
- Make sure MySQL is running
- Check that your root password is correct
- Verify the user was created: `SELECT User FROM mysql.user WHERE User = 'Harshkant';`


