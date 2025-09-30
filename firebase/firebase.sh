#!/bin/bash

# Quick setup script for Firebase service account
# This is a wrapper around the Node.js script for convenience

echo "🔧 Firebase Service Account Quick Setup"
echo ""

if [ -z "$1" ]; then
    echo "Usage: ./quick-setup-firebase.sh <path-to-service-account.json>"
    echo ""
    echo "Example:"
    echo "  ./quick-setup-firebase.sh ~/Downloads/service-account.json"
    echo ""
    echo "Or use the interactive mode:"
    echo "  npm run setup:firebase"
    exit 1
fi

node scripts/setup-service-account.js "$@"