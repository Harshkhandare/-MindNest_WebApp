# Fix: "Access denied for user 'root'@'localhost' (using password: NO)"

## Quick Fix - 3 Steps

### Step 1: Create MySQL User

Run this command and enter your MySQL root password when prompted:

```bash
node create-user-simple.js
```

**OR** manually in MySQL:

1. Open MySQL Command Line or Workbench
2. Connect as root: `mysql -u root -p`
3. Run these commands:

```sql
CREATE DATABASE IF NOT EXISTS mindnest;
CREATE USER IF NOT EXISTS 'Harshkant'@'localhost' IDENTIFIED BY 'Harsh@9712';
GRANT ALL PRIVILEGES ON mindnest.* TO 'Harshkant'@'localhost';
FLUSH PRIVILEGES;
```

### Step 2: Update .env File

Make sure your `.env` file has:

```env
DB_HOST=localhost
DB_USER=Harshkant
DB_PASSWORD=Harsh@9712
DB_NAME=mindnest
```

### Step 3: Start Server

```bash
npm run dev
```

You should see:
- ✅ MySQL Connected: localhost
- ✅ User: Harshkant
- ✅ Database tables initialized


