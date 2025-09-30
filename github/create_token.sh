#!/bin/bash

# Function to get current date in ISO 8601 format
get_expiration_date() {
    date -u -d "+1 hour" "+%Y-%m-%dT%H:%M:%SZ"
}

# Function to create a temporary name with current timestamp
get_token_name() {
    echo "Temporary Token - $(date "+%Y-%m-%d %H:%M")"
}

# Prompt for PAT securely
echo -n "Enter your GitHub Personal Access Token with access to create tokens: "
read -s GITHUB_TOKEN
echo

# Get expiration date (1 hour from now)
EXPIRATION=$(get_expiration_date)
TOKEN_NAME=$(get_token_name)

# Create JSON payload
JSON_DATA=$(cat << EOF
{
  "name": "$TOKEN_NAME",
  "expiration": "$EXPIRATION",
  "repositories": ["tyrellshawn/scripts"],
  "permissions": {
    "contents": "write",
    "metadata": "read",
    "pull_requests": "write",
    "workflows": "write"
  }
}
EOF
)

# Make API request
response=$(curl -s -X POST \
    -H "Accept: application/vnd.github.v3+json" \
    -H "Authorization: Bearer $GITHUB_TOKEN" \
    -H "Content-Type: application/json" \
    -d "$JSON_DATA" \
    "https://api.github.com/admin/fine-grained-tokens")

# Check if the request was successful
if echo "$response" | grep -q "token"; then
    # Extract token from response
    token=$(echo "$response" | grep -o '"token": "[^"]*' | cut -d'"' -f4)
    
    # Save to file
    echo "Token: $token" > temp_token.txt
    echo "Expires: $EXPIRATION" >> temp_token.txt
    
    echo -e "\nToken created successfully!"
    echo "Token has been saved to temp_token.txt"
    echo "Expires: $EXPIRATION"
else
    echo "Error creating token:"
    echo "$response"
fi