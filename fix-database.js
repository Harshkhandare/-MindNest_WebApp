// Database Connection Fix Script
// Run this to test and fix database connection

const mysql = require('mysql2/promise');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function testConnection(config) {
  try {
    const connection = await mysql.createConnection(config);
    await connection.execute('SELECT 1');
    console.log('✅ Connection successful!');
    await connection.end();
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    return false;
  }
}

async function setupDatabase() {
  console.log('\n🔧 MindNest Database Setup\n');
  console.log('This script will help you set up the MySQL database.\n');

  // Get root password
  const rootPassword = await question('Enter MySQL root password (or press Enter if no password): ');
  
  const rootConfig = {
    host: 'localhost',
    user: 'root',
    password: rootPassword || undefined,
    multipleStatements: true
  };

  // Test root connection
  console.log('\n📡 Testing root connection...');
  const rootConnected = await testConnection(rootConfig);
  
  if (!rootConnected) {
    console.log('\n❌ Cannot connect as root. Please check:');
    console.log('   1. MySQL is running');
    console.log('   2. Root password is correct');
    console.log('   3. MySQL is accessible on localhost:3306');
    rl.close();
    return;
  }

  try {
    const connection = await mysql.createConnection(rootConfig);
    
    console.log('\n📦 Creating database and user...');
    
    // Create database
    await connection.execute('CREATE DATABASE IF NOT EXISTS mindnest CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    console.log('✅ Database "mindnest" created');

    // Drop existing user if exists
    try {
      await connection.execute(`DROP USER IF EXISTS 'Harshkant'@'localhost'`);
    } catch (e) {
      // Ignore
    }

    // Create user
    await connection.execute(`
      CREATE USER 'Harshkant'@'localhost' IDENTIFIED BY 'Harsh@9712'
    `);
    console.log('✅ User "Harshkant" created');

    // Grant privileges
    await connection.execute('GRANT ALL PRIVILEGES ON mindnest.* TO \'Harshkant\'@\'localhost\'');
    await connection.execute('FLUSH PRIVILEGES');
    console.log('✅ Privileges granted');

    await connection.end();

    // Test new user connection
    console.log('\n📡 Testing new user connection...');
    const userConfig = {
      host: 'localhost',
      user: 'Harshkant',
      password: 'Harsh@9712',
      database: 'mindnest'
    };

    const userConnected = await testConnection(userConfig);
    
    if (userConnected) {
      console.log('\n🎉 Database setup complete!');
      console.log('\n✅ You can now start the server with: npm run dev');
    } else {
      console.log('\n⚠️  Setup completed but connection test failed.');
      console.log('   Try restarting MySQL service and run again.');
    }

  } catch (error) {
    console.error('\n❌ Setup error:', error.message);
  }

  rl.close();
}

// Run setup
setupDatabase().catch(console.error);

