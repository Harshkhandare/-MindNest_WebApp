/**
 * MindNest Setup Verification Script
 * Run this to verify your setup is correct before starting the server
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying MindNest Setup...\n');

let hasErrors = false;

// Check 1: .env file exists
console.log('1. Checking .env file...');
if (fs.existsSync(path.join(__dirname, '.env'))) {
  console.log('   ✅ .env file exists');
  
  // Check if required variables are present
  const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
  const requiredVars = ['PORT', 'MONGODB_URI', 'JWT_SECRET', 'NODE_ENV'];
  const missingVars = requiredVars.filter(v => !envContent.includes(`${v}=`));
  
  if (missingVars.length === 0) {
    console.log('   ✅ All required environment variables are present');
  } else {
    console.log(`   ⚠️  Missing variables: ${missingVars.join(', ')}`);
    hasErrors = true;
  }
} else {
  console.log('   ❌ .env file not found');
  hasErrors = true;
}

// Check 2: node_modules exists
console.log('\n2. Checking dependencies...');
if (fs.existsSync(path.join(__dirname, 'node_modules'))) {
  console.log('   ✅ node_modules directory exists');
  
  // Check critical packages
  const criticalPackages = ['express', 'mongoose', 'jsonwebtoken', 'bcryptjs'];
  const missingPackages = criticalPackages.filter(pkg => {
    return !fs.existsSync(path.join(__dirname, 'node_modules', pkg));
  });
  
  if (missingPackages.length === 0) {
    console.log('   ✅ All critical packages are installed');
  } else {
    console.log(`   ⚠️  Missing packages: ${missingPackages.join(', ')}`);
    console.log('   💡 Run: npm install');
    hasErrors = true;
  }
} else {
  console.log('   ❌ node_modules not found');
  console.log('   💡 Run: npm install');
  hasErrors = true;
}

// Check 3: Critical files exist
console.log('\n3. Checking critical files...');
const criticalFiles = [
  'server/app.js',
  'server/config/db.js',
  'server/middleware/auth.middleware.js',
  'client/index.html',
  'client/js/config.js',
  'client/js/utils.js',
  'package.json'
];

let missingFiles = [];
criticalFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    missingFiles.push(file);
  }
});

if (missingFiles.length === 0) {
  console.log('   ✅ All critical files are present');
} else {
  console.log(`   ❌ Missing files: ${missingFiles.join(', ')}`);
  hasErrors = true;
}

// Check 4: Models exist
console.log('\n4. Checking database models...');
const models = ['User', 'Mood', 'Journal', 'Goal', 'Post', 'Reminder'];
const modelsPath = path.join(__dirname, 'server', 'models');
let missingModels = [];

models.forEach(model => {
  const modelFile = path.join(modelsPath, `${model}.js`);
  if (!fs.existsSync(modelFile)) {
    missingModels.push(model);
  }
});

if (missingModels.length === 0) {
  console.log('   ✅ All database models are present');
} else {
  console.log(`   ❌ Missing models: ${missingModels.join(', ')}`);
  hasErrors = true;
}

// Check 5: Routes exist
console.log('\n5. Checking API routes...');
const routes = ['auth', 'mood', 'journal', 'goals', 'community', 'resources', 'reminders', 'user'];
const routesPath = path.join(__dirname, 'server', 'routes');
let missingRoutes = [];

routes.forEach(route => {
  const routeFile = path.join(routesPath, `${route}.routes.js`);
  if (!fs.existsSync(routeFile)) {
    missingRoutes.push(route);
  }
});

if (missingRoutes.length === 0) {
  console.log('   ✅ All API routes are present');
} else {
  console.log(`   ❌ Missing routes: ${missingRoutes.join(', ')}`);
  hasErrors = true;
}

// Check 6: Controllers exist
console.log('\n6. Checking controllers...');
const controllers = ['auth', 'mood', 'journal', 'goals', 'community', 'resources', 'reminders', 'user'];
const controllersPath = path.join(__dirname, 'server', 'controllers');
let missingControllers = [];

controllers.forEach(controller => {
  const controllerFile = path.join(controllersPath, `${controller}.controller.js`);
  if (!fs.existsSync(controllerFile)) {
    missingControllers.push(controller);
  }
});

if (missingControllers.length === 0) {
  console.log('   ✅ All controllers are present');
} else {
  console.log(`   ❌ Missing controllers: ${missingControllers.join(', ')}`);
  hasErrors = true;
}

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ Setup verification found some issues.');
  console.log('   Please fix the issues above before starting the server.');
  process.exit(1);
} else {
  console.log('✅ Setup verification complete!');
  console.log('\n📋 Next steps:');
  console.log('   1. Ensure MongoDB is running (local or Atlas)');
  console.log('   2. Start the server: npm run dev');
  console.log('   3. Open http://localhost:3000 in your browser');
  console.log('\n🚀 You\'re ready to go!');
  process.exit(0);
}



