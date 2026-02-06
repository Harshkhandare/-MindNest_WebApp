// Quick database connection test
const mysql = require('mysql2/promise');

async function testConnection() {
  console.log('🔍 Testing MySQL Connection...\n');
  
  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'Harshkant',
    password: process.env.DB_PASSWORD || 'Harsh@9712',
    database: process.env.DB_NAME || 'mindnest',
    connectTimeout: 5000
  };

  console.log('Configuration:');
  console.log(`  Host: ${config.host}`);
  console.log(`  User: ${config.user}`);
  console.log(`  Database: ${config.database}`);
  console.log('');

  try {
    const connection = await mysql.createConnection(config);
    console.log('✅ Connection successful!');
    
    // Test query
    const [rows] = await connection.execute('SELECT DATABASE() as db, USER() as user');
    console.log(`✅ Connected to database: ${rows[0].db}`);
    console.log(`✅ Connected as user: ${rows[0].user}`);
    
    // Check tables
    const [tables] = await connection.execute('SHOW TABLES');
    console.log(`✅ Found ${tables.length} tables`);
    
    await connection.end();
    console.log('\n🎉 Database connection is working correctly!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('\n💡 Troubleshooting:');
    
    if (error.message.includes('Access denied')) {
      console.log('   - Check username and password');
      console.log('   - Verify user exists: SELECT User FROM mysql.user WHERE User = \'Harshkant\';');
      console.log('   - Run: npm run setup-db');
    } else if (error.message.includes('Unknown database')) {
      console.log('   - Database does not exist');
      console.log('   - Run: npm run setup-db');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log('   - MySQL server is not running');
      console.log('   - Start MySQL service: net start MySQL80');
    } else {
      console.log('   - Check MySQL is running');
      console.log('   - Verify credentials in .env file');
      console.log('   - Run: npm run setup-db');
    }
    
    process.exit(1);
  }
}

testConnection();

