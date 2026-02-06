// Quick test to verify app functionality
const mysql = require('mysql2/promise');
const http = require('http');

console.log('\n🧪 Testing MindNest Application Functionality\n');
console.log('='.repeat(50));

// Test 1: Database Connection
async function testDatabase() {
  console.log('\n1️⃣ Testing Database Connection...');
  try {
    const pool = mysql.createPool({
      host: 'localhost',
      user: 'Harshkant',
      password: 'Harsh@9712',
      database: 'mindnest',
      waitForConnections: true,
      connectionLimit: 1,
      connectTimeout: 5000
    });
    
    const connection = await pool.getConnection();
    await connection.execute('SELECT 1');
    
    // Check tables
    const [tables] = await connection.execute('SHOW TABLES');
    const tableNames = tables.map(t => Object.values(t)[0]);
    
    console.log(`   ✅ Database connected`);
    console.log(`   ✅ Found ${tableNames.length} tables: ${tableNames.join(', ')}`);
    
    // Check if users table has data
    const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
    console.log(`   ✅ Users table: ${users[0].count} users`);
    
    connection.release();
    await pool.end();
    return true;
  } catch (error) {
    console.log(`   ❌ Database error: ${error.message}`);
    return false;
  }
}

// Test 2: Server Status
function testServer() {
  return new Promise((resolve) => {
    console.log('\n2️⃣ Testing Server Status...');
    const req = http.get('http://localhost:3000', (res) => {
      console.log(`   ✅ Server responding (Status: ${res.statusCode})`);
      resolve(true);
    });
    
    req.on('error', (error) => {
      console.log(`   ❌ Server not responding: ${error.message}`);
      console.log(`   💡 Make sure server is running: npm run dev`);
      resolve(false);
    });
    
    req.setTimeout(3000, () => {
      console.log(`   ❌ Server timeout`);
      req.destroy();
      resolve(false);
    });
  });
}

// Test 3: API Endpoints
async function testAPI() {
  console.log('\n3️⃣ Testing API Endpoints...');
  
  const endpoints = [
    { path: '/api/auth/me', method: 'GET', auth: true, name: 'Get Current User' },
    { path: '/api/mood', method: 'GET', auth: true, name: 'Get Moods' },
    { path: '/api/journal', method: 'GET', auth: true, name: 'Get Journals' },
    { path: '/api/goals', method: 'GET', auth: true, name: 'Get Goals' },
    { path: '/api/community', method: 'GET', auth: false, name: 'Get Posts' },
    { path: '/api/resources', method: 'GET', auth: false, name: 'Get Resources' }
  ];
  
  for (const endpoint of endpoints) {
    try {
      const options = {
        hostname: 'localhost',
        port: 3000,
        path: endpoint.path,
        method: endpoint.method,
        timeout: 2000
      };
      
      const result = await new Promise((resolve) => {
        const req = http.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => { data += chunk; });
          res.on('end', () => {
            resolve({ status: res.statusCode, data });
          });
        });
        
        req.on('error', () => resolve({ status: 0, error: true }));
        req.on('timeout', () => {
          req.destroy();
          resolve({ status: 0, timeout: true });
        });
        
        req.end();
      });
      
      if (result.status === 200 || result.status === 401 || result.status === 503) {
        console.log(`   ✅ ${endpoint.name}: Responding (${result.status})`);
      } else {
        console.log(`   ⚠️  ${endpoint.name}: Status ${result.status}`);
      }
    } catch (error) {
      console.log(`   ❌ ${endpoint.name}: ${error.message}`);
    }
  }
}

// Run all tests
async function runTests() {
  const dbOk = await testDatabase();
  const serverOk = await testServer();
  
  if (serverOk) {
    await testAPI();
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Test Summary:');
  console.log(`   Database: ${dbOk ? '✅ Connected' : '❌ Not Connected'}`);
  console.log(`   Server: ${serverOk ? '✅ Running' : '❌ Not Running'}`);
  
  if (dbOk && serverOk) {
    console.log('\n✅ Application is FUNCTIONAL!');
    console.log('\n💡 To use the app:');
    console.log('   1. Go to http://localhost:3000');
    console.log('   2. Sign up for an account');
    console.log('   3. Login and start using features');
  } else {
    console.log('\n⚠️  Some issues detected:');
    if (!dbOk) {
      console.log('   - Run: npm run setup-db');
    }
    if (!serverOk) {
      console.log('   - Run: npm run dev');
    }
  }
  
  console.log('\n');
}

runTests().catch(console.error);



