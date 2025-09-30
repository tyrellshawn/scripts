# Firebase Scripts

A collection of scripts to set up and test Firebase service accounts for your project.

## Scripts

- `firebase.sh`: Bash wrapper script for quick Firebase service account setup.
- `setup-service-account.js`: Node.js script to configure the service account in `.env.local`.
- `test-service-account.js`: Test script to verify Firebase Admin SDK connection.
- `test-firebase.sh`: Bash script to run the Firebase test.

## Usage

1. Download your Firebase service account JSON file from the Firebase Console.
2. Run the setup script:
   - `./firebase.sh path/to/service-account.json`
   - Or: `node setup-service-account.js path/to/service-account.json`
3. Test the connection: `./test-firebase.sh` or `node test-service-account.js`

## Prerequisites

- Node.js installed
- Firebase Admin SDK dependencies installed in your project