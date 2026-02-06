const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

let pool = null;

const connectDB = async () => {
  try {
    // First, try to connect with Harshkant user
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'Harshkant',
      password: process.env.DB_PASSWORD || 'Harsh@9712',
      database: process.env.DB_NAME || 'mindnest',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      multipleStatements: true
    });

    // Test connection
    const connection = await pool.getConnection();
    console.log(`✅ MySQL Connected: ${connection.config.host}`);
    console.log(`✅ User: ${connection.config.user}`);
    connection.release();

    // Initialize database tables
    await initializeTables();
  } catch (error) {
    // If connection fails, try to create user with root
    if (error.message.includes('Access denied') || error.message.includes('Unknown database')) {
      console.error('⚠️  MySQL connection error:', error.message);
      console.log('💡 Attempting to create database and user...');
      
      try {
        await createDatabaseAndUser();
        // Retry connection with Harshkant
        pool = mysql.createPool({
          host: process.env.DB_HOST || 'localhost',
          user: 'Harshkant',
          password: 'Harsh@9712',
          database: 'mindnest',
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0,
          multipleStatements: true
        });
        const connection = await pool.getConnection();
        console.log(`✅ MySQL Connected: ${connection.config.host}`);
        connection.release();
        await initializeTables();
      } catch (setupError) {
        console.error('⚠️  Setup error:', setupError.message);
        console.log('⚠️  Server will continue without database. Some features may not work.');
        console.log('💡 To fix manually:');
        console.log('   1. Connect to MySQL as root');
        console.log('   2. Run: CREATE DATABASE IF NOT EXISTS mindnest;');
        console.log('   3. Run: CREATE USER IF NOT EXISTS \'Harshkant\'@\'localhost\' IDENTIFIED BY \'Harsh@9712\';');
        console.log('   4. Run: GRANT ALL PRIVILEGES ON mindnest.* TO \'Harshkant\'@\'localhost\';');
        console.log('   5. Run: FLUSH PRIVILEGES;');
      }
    } else {
      console.error('⚠️  MySQL connection error:', error.message);
      console.log('⚠️  Server will continue without database. Some features may not work.');
      console.log('💡 To fix: Start MySQL or update DB credentials in .env file');
    }
  }
};

const createDatabaseAndUser = async () => {
  // Try to connect as root to create user
  const rootPassword = process.env.MYSQL_ROOT_PASSWORD || '';
  
  if (!rootPassword) {
    throw new Error('MYSQL_ROOT_PASSWORD not set in .env. Cannot create user automatically.');
  }

  try {
    const rootPool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: 'root',
      password: rootPassword,
      waitForConnections: true,
      connectionLimit: 5
    });

    // Create database
    await rootPool.execute('CREATE DATABASE IF NOT EXISTS mindnest');
    console.log('✅ Database "mindnest" created');

    // Create user
    await rootPool.execute(`
      CREATE USER IF NOT EXISTS 'Harshkant'@'localhost' IDENTIFIED BY 'Harsh@9712'
    `);
    console.log('✅ User "Harshkant" created');

    // Grant privileges
    await rootPool.execute('GRANT ALL PRIVILEGES ON mindnest.* TO \'Harshkant\'@\'localhost\'');
    await rootPool.execute('FLUSH PRIVILEGES');
    console.log('✅ Privileges granted');

    rootPool.end();
  } catch (error) {
    throw new Error(`Failed to create database/user: ${error.message}`);
  }
};

const initializeTables = async () => {
  if (!pool) return;

  try {
    // Users table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(20) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        firstName VARCHAR(100),
        lastName VARCHAR(100),
        dateOfBirth DATE,
        profilePicture VARCHAR(500) DEFAULT '',
        theme ENUM('light', 'dark') DEFAULT 'light',
        highContrast BOOLEAN DEFAULT FALSE,
        textToSpeech BOOLEAN DEFAULT FALSE,
        notifications BOOLEAN DEFAULT TRUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        lastLogin TIMESTAMP NULL,
        INDEX idx_email (email),
        INDEX idx_username (username)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Moods table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS moods (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        moodLevel INT NOT NULL CHECK (moodLevel >= 1 AND moodLevel <= 10),
        emotion ENUM('happy', 'sad', 'anxious', 'angry', 'calm', 'tired', 'energetic', 'neutral') DEFAULT 'neutral',
        note TEXT,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_date (userId, date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Journals table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS journals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        title VARCHAR(100),
        content TEXT NOT NULL,
        mood VARCHAR(50),
        isEncrypted BOOLEAN DEFAULT FALSE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_created (userId, createdAt)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Journal tags (many-to-many)
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS journal_tags (
        id INT AUTO_INCREMENT PRIMARY KEY,
        journalId INT NOT NULL,
        tag VARCHAR(50) NOT NULL,
        FOREIGN KEY (journalId) REFERENCES journals(id) ON DELETE CASCADE,
        INDEX idx_journal (journalId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Goals table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS goals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        title VARCHAR(100) NOT NULL,
        description TEXT,
        type ENUM('daily', 'weekly', 'monthly') DEFAULT 'daily',
        status ENUM('pending', 'in-progress', 'completed', 'cancelled') DEFAULT 'pending',
        progress INT DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
        targetDate DATE,
        completedAt TIMESTAMP NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_status (userId, status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Posts table (Community)
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        content TEXT NOT NULL,
        isAnonymous BOOLEAN DEFAULT TRUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_created (createdAt)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Post likes (many-to-many)
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS post_likes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        postId INT NOT NULL,
        userId INT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_like (postId, userId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Post comments
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS post_comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        postId INT NOT NULL,
        userId INT NOT NULL,
        content TEXT NOT NULL,
        isAnonymous BOOLEAN DEFAULT TRUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_post (postId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Post tags
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS post_tags (
        id INT AUTO_INCREMENT PRIMARY KEY,
        postId INT NOT NULL,
        tag VARCHAR(50) NOT NULL,
        FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Mood tags
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS mood_tags (
        id INT AUTO_INCREMENT PRIMARY KEY,
        moodId INT NOT NULL,
        tag VARCHAR(50) NOT NULL,
        FOREIGN KEY (moodId) REFERENCES moods(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Reminders table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS reminders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        type ENUM('medication', 'therapy', 'exercise', 'custom') NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        time TIME NOT NULL,
        isActive BOOLEAN DEFAULT TRUE,
        lastTriggered TIMESTAMP NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_active (userId, isActive)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Reminder days (many-to-many)
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS reminder_days (
        id INT AUTO_INCREMENT PRIMARY KEY,
        reminderId INT NOT NULL,
        day INT NOT NULL CHECK (day >= 0 AND day <= 6),
        FOREIGN KEY (reminderId) REFERENCES reminders(id) ON DELETE CASCADE,
        UNIQUE KEY unique_day (reminderId, day)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    console.log('✅ Database tables initialized');
  } catch (error) {
    console.error('Error initializing tables:', error.message);
  }
};

const getPool = () => pool;

module.exports = { connectDB, getPool };
