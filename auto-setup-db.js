// Automated Database Setup Script
// Tries to set up database automatically without user input

const mysql = require('mysql2/promise');

async function testConnection(config) {
  try {
    const connection = await mysql.createConnection(config);
    await connection.execute('SELECT 1');
    await connection.end();
    return true;
  } catch (error) {
    return false;
  }
}

async function setupDatabase() {
  console.log('\n🔧 MindNest Automated Database Setup\n');
  console.log('Attempting to set up database automatically...\n');

  // Try common root password scenarios
  const rootPasswords = ['', 'root', 'password', '123456', 'admin'];
  let rootConfig = null;
  let rootConnected = false;

  // First, try without password
  console.log('📡 Testing root connection (no password)...');
  rootConfig = {
    host: 'localhost',
    user: 'root',
    password: undefined,
    multipleStatements: true,
    connectTimeout: 5000
  };
  
  rootConnected = await testConnection(rootConfig);
  
  if (!rootConnected) {
    // Try with common passwords
    for (const pwd of rootPasswords) {
      if (pwd === '') continue; // Already tried
      console.log(`📡 Testing root connection (password: ${pwd ? '***' : 'none'})...`);
      rootConfig = {
        host: 'localhost',
        user: 'root',
        password: pwd,
        multipleStatements: true,
        connectTimeout: 5000
      };
      rootConnected = await testConnection(rootConfig);
      if (rootConnected) {
        console.log('✅ Root connection successful!');
        break;
      }
    }
  } else {
    console.log('✅ Root connection successful (no password)!');
  }

  if (!rootConnected) {
    console.log('\n❌ Cannot connect as root. Please run manually:');
    console.log('   npm run setup-db');
    console.log('\nOr use setup-and-run.bat with your MySQL root password.');
    return false;
  }

  try {
    const connection = await mysql.createConnection(rootConfig);
    
    console.log('\n📦 Creating database and user...');
    
    // Create database
    await connection.execute('CREATE DATABASE IF NOT EXISTS mindnest CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    console.log('✅ Database "mindnest" created');

    // Drop existing user if exists (to avoid conflicts)
    try {
      await connection.execute(`DROP USER IF EXISTS 'Harshkant'@'localhost'`);
    } catch (e) {
      // Ignore if user doesn't exist
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
      database: 'mindnest',
      connectTimeout: 5000
    };

    const userConnected = await testConnection(userConfig);
    
    if (userConnected) {
      console.log('✅ User connection successful!');
      console.log('\n🎉 Database setup complete!');
      console.log('\n✅ Database: mindnest');
      console.log('✅ User: Harshkant');
      console.log('✅ Password: Harsh@9712');
      console.log('\n✅ You can now start the server with: npm run dev');
      return true;
    } else {
      console.log('\n⚠️  Setup completed but connection test failed.');
      console.log('   Try restarting MySQL service and run again.');
      return false;
    }

  } catch (error) {
    console.error('\n❌ Setup error:', error.message);
    if (error.message.includes('Access denied')) {
      console.log('\n💡 Tip: You may need to run this with your MySQL root password.');
      console.log('   Use: npm run setup-db (interactive)');
      console.log('   Or: setup-and-run.bat');
    }
    return false;
  }
}

// Run setup
setupDatabase()
  .then(success => {
    if (success) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

