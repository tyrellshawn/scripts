// Test script for Firebase Admin SDK
// Run with: node test-firebase-admin.js

// Load environment variables
require('dotenv').config();

// Since we're in a Node.js environment, we can use the service account file directly
const fs = require('fs');
const path = require('path');

// Check if service account exists in environment variable or file
let serviceAccount;
const serviceAccountPath = path.join(__dirname, 'service-account.json');

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  console.log('✅ Using service account from environment variable');
} else if (fs.existsSync(serviceAccountPath)) {
  serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  console.log('✅ Using service account from file:', serviceAccountPath);
} else {
  console.error('❌ No service account found. Please:');
  console.error('1. Set FIREBASE_SERVICE_ACCOUNT environment variable, or');
  console.error('2. Place service-account.json in the project root');
  process.exit(1);
}

// Initialize Firebase Admin SDK directly for testing
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const adminApp = initializeApp({
  credential: cert(serviceAccount)
});

const adminDb = getFirestore(adminApp);

async function testFirebaseAdmin() {
  try {
    console.log('Testing Firebase Admin SDK...');
    
    // Test reading from Firestore
    const snapshot = await adminDb.collection('users').limit(1).get();
    
    if (snapshot.empty) {
      console.log('No users found in Firestore');
    } else {
      console.log('Successfully connected to Firestore');
      console.log('Found', snapshot.size, 'users');
    }
    
    console.log('✅ Firebase Admin SDK test completed successfully');
  } catch (error) {
    console.error('❌ Firebase Admin SDK test failed:', error.message);
    console.log('Make sure you have:');
    console.log('1. Downloaded your service account JSON from Firebase Console');
    console.log('2. Placed it as service-account.json in the project root');
    console.log('3. Or set FIREBASE_SERVICE_ACCOUNT environment variable');
  }
}

testFirebaseAdmin();