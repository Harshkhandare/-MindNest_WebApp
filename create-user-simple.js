// Simple script to create MySQL user using root
require('dotenv').config();
const mysql = require('mysql2/promise');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createUser() {
  try {
    console.log('\n🔧 MySQL User Setup for MindNest\n');
    
    // Get root password
    const rootPassword = await question('Enter MySQL root password: ');
    
    if (!rootPassword) {
      console.log('❌ Root password is required!');
      rl.close();
      process.exit(1);
    }

    console.log('\n📝 Creating database and user...\n');

    // Connect as root
    const rootConnection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: rootPassword
    });

    // Create database
    await rootConnection.execute('CREATE DATABASE IF NOT EXISTS mindnest');
    console.log('✅ Database "mindnest" created');

    // Create user
    await rootConnection.execute(`
      CREATE USER IF NOT EXISTS 'Harshkant'@'localhost' IDENTIFIED BY 'Harsh@9712'
    `);
    console.log('✅ User "Harshkant" created');

    // Grant privileges
    await rootConnection.execute('GRANT ALL PRIVILEGES ON mindnest.* TO \'Harshkant\'@\'localhost\'');
    await rootConnection.execute('FLUSH PRIVILEGES');
    console.log('✅ Privileges granted');

    // Test connection with new user
    await rootConnection.end();
    
    const testConnection = await mysql.createConnection({
      host: 'localhost',
      user: 'Harshkant',
      password: 'Harsh@9712',
      database: 'mindnest'
    });
    
    console.log('✅ Connection test successful!');
    await testConnection.end();

    console.log('\n🎉 Setup complete! You can now start the server: npm run dev\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.message.includes('Access denied')) {
      console.log('💡 Check your MySQL root password and try again.\n');
    }
  } finally {
    rl.close();
  }
}

createUser();


