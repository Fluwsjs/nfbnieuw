const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
console.log('Checking env file at:', envPath);

if (!fs.existsSync(envPath)) {
  console.error('.env.local file not found at', envPath);
  process.exit(1);
}

const envConfig = dotenv.parse(fs.readFileSync(envPath));

console.log('Current DATABASE_URL from .env.local:', envConfig.DATABASE_URL);

// Check if DATABASE_URL starts with mongodb:// or mongodb+srv://
if (!envConfig.DATABASE_URL.startsWith('mongodb://') && !envConfig.DATABASE_URL.startsWith('mongodb+srv://')) {
  console.error('Invalid MongoDB connection string. Must start with mongodb:// or mongodb+srv://.');
  console.error('Current value starts with:', envConfig.DATABASE_URL.substring(0, 20) + '...');
  process.exit(1);
}

// Test accessing the DATABASE_URL directly from process.env
console.log('DATABASE_URL from process.env:', process.env.DATABASE_URL);

// If process.env.DATABASE_URL is missing or different, we need to fix it
if (!process.env.DATABASE_URL || process.env.DATABASE_URL !== envConfig.DATABASE_URL) {
  console.log('DATABASE_URL in process.env is not set correctly.');
  console.log('Attempting to fix by setting it manually...');
  
  process.env.DATABASE_URL = envConfig.DATABASE_URL;
  console.log('Updated DATABASE_URL in process.env:', process.env.DATABASE_URL);
}

console.log('MongoDB connection validation check complete.'); 