// Test MySQL Connection
require('dotenv').config();
const mysql = require('mysql2/promise');

(async () => {
  try {
    console.log('\n🧪 Testing MySQL connection...\n');
    
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'Harshkant',
      password: process.env.DB_PASSWORD || 'Harsh@9712',
      database: process.env.DB_NAME || 'mindnest'
    });
    
    const conn = await pool.getConnection();
    console.log('✅ SUCCESS! User Harshkant exists and can connect!');
    console.log(`   Connected to: ${conn.config.host}`);
    console.log(`   Database: ${conn.config.database}`);
    conn.release();
    
    // Test query
    const [rows] = await pool.execute('SHOW TABLES');
    console.log(`\n✅ Database tables: ${rows.length} tables found`);
    
    process.exit(0);
  } catch (e) {
    console.log('\n❌ Connection failed:', e.message);
    console.log('\n💡 NEXT STEP: Create the MySQL user first!');
    console.log('   See: MYSQL_USER_SETUP_INSTRUCTIONS.md\n');
    process.exit(1);
  }
})();


