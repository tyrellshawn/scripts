#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to setup Firebase service account in .env.local
 * Usage: node scripts/setup-service-account.js [service-account.json]
 */

function showHelp() {
  console.log(`
🔧 Firebase Service Account Setup Script

Usage:
  node scripts/setup-service-account.js [path-to-service-account.json]

Options:
  --help, -h     Show this help message
  --method, -m   Method to use: 'env' (default) or 'file'

Examples:
  # Use environment variable method (recommended)
  node scripts/setup-service-account.js service-account.json

  # Use file method (for development)
  node scripts/setup-service-account.js service-account.json --method file

  # Interactive mode
  node scripts/setup-service-account.js
`);
}

function validateServiceAccount(data) {
  const requiredFields = ['type', 'project_id', 'private_key', 'client_email'];
  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Invalid service account: missing fields ${missingFields.join(', ')}`);
  }
  
  if (data.type !== 'service_account') {
    throw new Error('Invalid service account: type must be "service_account"');
  }
  
  return true;
}

function updateEnvLocal(serviceAccountData, method = 'env') {
  const envPath = path.join(process.cwd(), '.env.local');
  let envContent = '';
  
  // Read existing .env.local if it exists
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }
  
  // Remove existing service account configurations
  const lines = envContent.split('\n').filter(line => {
    return !line.startsWith('FIREBASE_SERVICE_ACCOUNT=') && 
           !line.startsWith('SERVICE_ACCOUNT_PATH=');
  });
  
  // Add new configuration
  if (method === 'env') {
    // Environment variable method
    const serviceAccountJson = JSON.stringify(serviceAccountData);
    lines.push(`# Firebase Service Account (Added ${new Date().toISOString()})`);
    lines.push(`FIREBASE_SERVICE_ACCOUNT=${serviceAccountJson}`);
    console.log('✅ Service account will be stored in environment variable');
  } else {
    // File method
    lines.push(`# Firebase Service Account Path (Added ${new Date().toISOString()})`);
    lines.push('SERVICE_ACCOUNT_PATH=./service-account.json');
    console.log('✅ Service account will be loaded from file');
  }
  
  // Write updated content
  fs.writeFileSync(envPath, lines.join('\n'));
  
  console.log(`✅ Updated ${envPath}`);
}

function copyServiceAccountFile(sourcePath) {
  const targetPath = path.join(process.cwd(), 'service-account.json');
  
  if (path.resolve(sourcePath) === path.resolve(targetPath)) {
    console.log('ℹ️  Service account file is already in the correct location');
    return;
  }
  
  try {
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`✅ Copied service account to ${targetPath}`);
  } catch (error) {
    throw new Error(`Failed to copy service account file: ${error.message}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  // Show help if requested
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }
  
  // Parse arguments
  let serviceAccountPath = null;
  let method = 'env';
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--method' || arg === '-m') {
      method = args[i + 1];
      if (!['env', 'file'].includes(method)) {
        console.error('❌ Invalid method. Use "env" or "file"');
        process.exit(1);
      }
      i++; // Skip next argument
    } else if (!arg.startsWith('-')) {
      serviceAccountPath = arg;
    }
  }
  
  // Interactive mode if no path provided
  if (!serviceAccountPath) {
    console.log('\n🔧 Firebase Service Account Setup\n');
    console.log('Please drag and drop your service account JSON file here,');
    console.log('or provide the path as an argument.\n');
    
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    serviceAccountPath = await new Promise((resolve) => {
      rl.question('Path to service account file: ', (answer) => {
        rl.close();
        resolve(answer.trim().replace(/['"]/g, '')); // Remove quotes
      });
    });
  }
  
  try {
    // Validate file exists
    if (!fs.existsSync(serviceAccountPath)) {
      throw new Error(`Service account file not found: ${serviceAccountPath}`);
    }
    
    // Read and validate service account
    const serviceAccountData = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    validateServiceAccount(serviceAccountData);
    
    console.log(`\n✅ Valid service account found for project: ${serviceAccountData.project_id}\n`);
    
    // Copy file if using file method
    if (method === 'file') {
      copyServiceAccountFile(serviceAccountPath);
    }
    
    // Update .env.local
    updateEnvLocal(serviceAccountData, method);
    
    console.log('\n🎉 Setup complete!');
    console.log('\nNext steps:');
    console.log('1. Run: node test-firebase-admin.js');
    console.log('2. Test your API: npm run dev');
    console.log('3. Visit: http://localhost:3000/api/firebase');
    
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}\n`);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { validateServiceAccount, updateEnvLocal };