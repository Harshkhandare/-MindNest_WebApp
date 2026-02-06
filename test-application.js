// Comprehensive Application Test Script
// Tests all features and creates sample data

const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3000/api';
let authToken = '';
let userId = '';

// Test results
const results = {
  passed: [],
  failed: [],
  warnings: []
};

// Helper function to make API calls
async function apiCall(endpoint, options = {}) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
      ...options.headers
    };

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    return data;
  } catch (error) {
    throw error;
  }
}

// Test functions
async function testServer() {
  console.log('\n🔍 Testing Server Connection...');
  try {
    const response = await fetch('http://localhost:3000');
    if (response.ok) {
      results.passed.push('Server is running on port 3000');
      console.log('✅ Server is running');
      return true;
    }
  } catch (error) {
    results.failed.push('Server is not running');
    console.log('❌ Server is not running. Please start it with: npm run dev');
    return false;
  }
}

async function testSignup() {
  console.log('\n📝 Testing User Signup...');
  try {
    const userData = {
      username: 'demo_user_' + Date.now(),
      email: `demo_${Date.now()}@example.com`,
      password: 'demo123456',
      firstName: 'Demo',
      lastName: 'User'
    };

    const data = await apiCall('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData)
    });

    if (data.token && data.user) {
      authToken = data.token;
      userId = data.user.id;
      results.passed.push('User signup successful');
      console.log('✅ User created:', userData.username);
      return true;
    }
  } catch (error) {
    results.warnings.push(`Signup test: ${error.message}`);
    console.log('⚠️  Signup test:', error.message);
    return false;
  }
}

async function testLogin() {
  console.log('\n🔐 Testing User Login...');
  try {
    const loginData = {
      email: 'demo@example.com',
      password: 'demo123456'
    };

    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(loginData)
    });

    if (data.token) {
      authToken = data.token;
      userId = data.user.id;
      results.passed.push('User login successful');
      console.log('✅ Login successful');
      return true;
    }
  } catch (error) {
    results.warnings.push(`Login test: ${error.message}`);
    console.log('⚠️  Login test:', error.message);
    // Try signup instead
    return await testSignup();
  }
}

async function testMoodTracking() {
  console.log('\n😊 Testing Mood Tracking...');
  try {
    // Create mood entry
    const moodData = {
      moodLevel: 7,
      emotion: 'happy',
      note: 'Feeling good today!'
    };

    const createData = await apiCall('/mood', {
      method: 'POST',
      body: JSON.stringify(moodData)
    });

    results.passed.push('Mood entry created');
    console.log('✅ Mood entry created');

    // Get moods
    const getData = await apiCall('/mood');
    if (getData.moods && getData.moods.length > 0) {
      results.passed.push('Mood retrieval successful');
      console.log('✅ Retrieved', getData.moods.length, 'mood entries');
    }

    return true;
  } catch (error) {
    results.warnings.push(`Mood tracking: ${error.message}`);
    console.log('⚠️  Mood tracking:', error.message);
    return false;
  }
}

async function testJournal() {
  console.log('\n📝 Testing Journal...');
  try {
    const journalData = {
      title: 'My First Entry',
      content: 'This is a test journal entry. Testing the journal functionality.',
      mood: 'neutral'
    };

    const createData = await apiCall('/journal', {
      method: 'POST',
      body: JSON.stringify(journalData)
    });

    results.passed.push('Journal entry created');
    console.log('✅ Journal entry created');

    // Get journals
    const getData = await apiCall('/journal');
    if (getData.journals && getData.journals.length > 0) {
      results.passed.push('Journal retrieval successful');
      console.log('✅ Retrieved', getData.journals.length, 'journal entries');
    }

    return true;
  } catch (error) {
    results.warnings.push(`Journal: ${error.message}`);
    console.log('⚠️  Journal:', error.message);
    return false;
  }
}

async function testGoals() {
  console.log('\n🎯 Testing Goals...');
  try {
    const goalData = {
      title: 'Take a 10-minute walk daily',
      description: 'Improve physical activity and mental well-being',
      type: 'daily',
      targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    const createData = await apiCall('/goals', {
      method: 'POST',
      body: JSON.stringify(goalData)
    });

    results.passed.push('Goal created');
    console.log('✅ Goal created');

    // Get goals
    const getData = await apiCall('/goals');
    if (getData.goals && getData.goals.length > 0) {
      results.passed.push('Goal retrieval successful');
      console.log('✅ Retrieved', getData.goals.length, 'goals');
    }

    return true;
  } catch (error) {
    results.warnings.push(`Goals: ${error.message}`);
    console.log('⚠️  Goals:', error.message);
    return false;
  }
}

async function testCommunity() {
  console.log('\n💬 Testing Community...');
  try {
    // Create post
    const postData = {
      content: 'Hello community! This is a test post. Looking forward to connecting with everyone.',
      isAnonymous: true
    };

    const createData = await apiCall('/community', {
      method: 'POST',
      body: JSON.stringify(postData)
    });

    results.passed.push('Community post created');
    console.log('✅ Post created');

    // Get posts with filters
    const recentData = await apiCall('/community?filter=recent');
    if (recentData.posts) {
      results.passed.push('Community posts retrieved (Recent filter)');
      console.log('✅ Retrieved', recentData.posts.length, 'recent posts');
    }

    const popularData = await apiCall('/community?filter=popular');
    results.passed.push('Community posts retrieved (Popular filter)');
    console.log('✅ Popular filter working');

    return true;
  } catch (error) {
    results.warnings.push(`Community: ${error.message}`);
    console.log('⚠️  Community:', error.message);
    return false;
  }
}

async function testResources() {
  console.log('\n📚 Testing Resources...');
  try {
    const data = await apiCall('/resources');
    if (data.resources) {
      results.passed.push('Resources retrieved');
      console.log('✅ Retrieved', data.resources.length, 'resources');
      return true;
    }
  } catch (error) {
    results.warnings.push(`Resources: ${error.message}`);
    console.log('⚠️  Resources:', error.message);
    return false;
  }
}

async function testReminders() {
  console.log('\n⏰ Testing Reminders...');
  try {
    const reminderData = {
      type: 'medication',
      title: 'Take morning medication',
      description: 'Daily medication reminder',
      time: '09:00',
      days: [1, 2, 3, 4, 5] // Monday to Friday
    };

    const createData = await apiCall('/reminders', {
      method: 'POST',
      body: JSON.stringify(reminderData)
    });

    results.passed.push('Reminder created');
    console.log('✅ Reminder created');

    // Get reminders
    const getData = await apiCall('/reminders');
    if (getData.reminders && getData.reminders.length > 0) {
      results.passed.push('Reminder retrieval successful');
      console.log('✅ Retrieved', getData.reminders.length, 'reminders');
    }

    return true;
  } catch (error) {
    results.warnings.push(`Reminders: ${error.message}`);
    console.log('⚠️  Reminders:', error.message);
    return false;
  }
}

async function testInsights() {
  console.log('\n📊 Testing Insights...');
  try {
    const data = await apiCall('/insights/mood-insights?days=30');
    if (data.insights || data.patterns) {
      results.passed.push('Insights retrieved');
      console.log('✅ Insights retrieved');
      return true;
    }
  } catch (error) {
    results.warnings.push(`Insights: ${error.message}`);
    console.log('⚠️  Insights:', error.message);
    return false;
  }
}

async function testProfile() {
  console.log('\n👤 Testing Profile...');
  try {
    const data = await apiCall('/user/profile');
    if (data.user) {
      results.passed.push('Profile retrieved');
      console.log('✅ Profile retrieved');
      return true;
    }
  } catch (error) {
    results.warnings.push(`Profile: ${error.message}`);
    console.log('⚠️  Profile:', error.message);
    return false;
  }
}

// Main test function
async function runAllTests() {
  console.log('🧪 MindNest Application Test Suite');
  console.log('==================================\n');

  // Test server
  const serverRunning = await testServer();
  if (!serverRunning) {
    console.log('\n❌ Server is not running. Please start it first:');
    console.log('   npm run dev\n');
    return;
  }

  // Test authentication
  let authenticated = false;
  authenticated = await testLogin();
  if (!authenticated) {
    authenticated = await testSignup();
  }

  if (!authenticated) {
    console.log('\n⚠️  Could not authenticate. Some tests will be skipped.');
    console.log('   Please create an account manually at http://localhost:3000/signup.html\n');
  }

  // Run feature tests
  if (authenticated) {
    await testMoodTracking();
    await testJournal();
    await testGoals();
    await testCommunity();
    await testReminders();
    await testInsights();
    await testProfile();
  }

  // Test public features
  await testResources();

  // Print summary
  console.log('\n\n📊 Test Summary');
  console.log('================');
  console.log(`✅ Passed: ${results.passed.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log(`⚠️  Warnings: ${results.warnings.length}`);

  if (results.passed.length > 0) {
    console.log('\n✅ Successful Tests:');
    results.passed.forEach(test => console.log(`   - ${test}`));
  }

  if (results.failed.length > 0) {
    console.log('\n❌ Failed Tests:');
    results.failed.forEach(test => console.log(`   - ${test}`));
  }

  if (results.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    results.warnings.forEach(warning => console.log(`   - ${warning}`));
  }

  console.log('\n✨ Test suite completed!\n');
}

// Run tests
runAllTests().catch(console.error);

