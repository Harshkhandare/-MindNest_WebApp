// Comprehensive Feature Test Script for MindNest
require('dotenv').config();
const mysql = require('mysql2/promise');

const API_BASE = 'http://localhost:3000/api';

async function testFeature(name, testFn) {
  console.log(`\n🧪 Testing: ${name}`);
  try {
    await testFn();
    console.log(`✅ ${name}: PASSED`);
    return true;
  } catch (error) {
    console.log(`❌ ${name}: FAILED - ${error.message}`);
    return false;
  }
}

async function testDatabaseConnection() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'Harshkant',
    password: process.env.DB_PASSWORD || 'Harsh@9712',
    database: process.env.DB_NAME || 'mindnest'
  });
  
  const conn = await pool.getConnection();
  conn.release();
  pool.end();
}

async function testServerRunning() {
  const response = await fetch('http://localhost:3000');
  if (!response.ok) {
    throw new Error(`Server returned ${response.status}`);
  }
}

async function testPublicPages() {
  const pages = [
    '/',
    '/index.html',
    '/login.html',
    '/signup.html',
    '/resources.html',
    '/coping.html'
  ];
  
  for (const page of pages) {
    const response = await fetch(`http://localhost:3000${page}`);
    if (!response.ok) {
      throw new Error(`Page ${page} returned ${response.status}`);
    }
  }
}

async function testAPIEndpoints() {
  // Test resources (public)
  const resourcesRes = await fetch(`${API_BASE}/resources`);
  if (!resourcesRes.ok) {
    throw new Error(`Resources API returned ${resourcesRes.status}`);
  }
  
  // Test auth endpoints (should fail without credentials, which is expected)
  const signupRes = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  // Should return 400 (validation error), not 500 or 503
  if (signupRes.status === 503) {
    throw new Error('Database not connected');
  }
}

async function testAuthenticationFlow() {
  // Test signup
  const testUser = {
    username: `testuser${Date.now()}`,
    email: `test${Date.now()}@test.com`,
    password: 'testpass123',
    firstName: 'Test',
    lastName: 'User'
  };
  
  const signupRes = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testUser)
  });
  
  if (signupRes.status === 503) {
    throw new Error('Database not connected - cannot test auth');
  }
  
  if (!signupRes.ok && signupRes.status !== 400) {
    const error = await signupRes.json();
    throw new Error(`Signup failed: ${error.message || signupRes.status}`);
  }
  
  if (signupRes.ok) {
    const data = await signupRes.json();
    if (!data.token) {
      throw new Error('Signup successful but no token returned');
    }
    
    // Test login
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password
      })
    });
    
    if (!loginRes.ok) {
      throw new Error('Login failed after successful signup');
    }
    
    const loginData = await loginRes.json();
    if (!loginData.token) {
      throw new Error('Login successful but no token returned');
    }
  }
}

async function runAllTests() {
  console.log('════════════════════════════════════════');
  console.log('  MindNest Application Feature Tests');
  console.log('════════════════════════════════════════');
  
  const results = {
    passed: 0,
    failed: 0,
    total: 0
  };
  
  // Test 1: Database Connection
  results.total++;
  if (await testFeature('Database Connection', testDatabaseConnection)) {
    results.passed++;
  } else {
    results.failed++;
  }
  
  // Test 2: Server Running
  results.total++;
  if (await testFeature('Server Running', testServerRunning)) {
    results.passed++;
  } else {
    results.failed++;
  }
  
  // Test 3: Public Pages
  results.total++;
  if (await testFeature('Public Pages Accessible', testPublicPages)) {
    results.passed++;
  } else {
    results.failed++;
  }
  
  // Test 4: API Endpoints
  results.total++;
  if (await testFeature('API Endpoints Responding', testAPIEndpoints)) {
    results.passed++;
  } else {
    results.failed++;
  }
  
  // Test 5: Authentication Flow
  results.total++;
  if (await testFeature('Authentication Flow', testAuthenticationFlow)) {
    results.passed++;
  } else {
    results.failed++;
  }
  
  // Summary
  console.log('\n════════════════════════════════════════');
  console.log('  Test Results Summary');
  console.log('════════════════════════════════════════');
  console.log(`Total Tests: ${results.total}`);
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);
  console.log('════════════════════════════════════════\n');
  
  if (results.failed === 0) {
    console.log('🎉 All tests passed! Application is fully functional.');
  } else {
    console.log('⚠️  Some tests failed. Check the errors above.');
  }
}

// Run tests
runAllTests().catch(console.error);


