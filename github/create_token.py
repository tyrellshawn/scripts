import requests
import json
from datetime import datetime, timedelta
import os
from getpass import getpass

def create_fine_grained_token():
    # GitHub API endpoint
    url = "https://api.github.com/admin/fine-grained-tokens"
    
    # Calculate expiration (1 hour from now)
    expiration = (datetime.utcnow() + timedelta(hours=1)).strftime("%Y-%m-%dT%H:%M:%SZ")
    
    # Token payload
    payload = {
        "name": f"Temporary Token - {datetime.now().strftime('%Y-%m-%d %H:%M')}",
        "expiration": expiration,
        "repositories": ["tyrellshawn/scripts"],
        "permissions": {
            "contents": "write",
            "metadata": "read",
            "pull_requests": "write",
            "workflows": "write"
        }
    }
    
    # Get GitHub personal access token for authentication
    pat = getpass("Enter your GitHub Personal Access Token with access to create tokens: ")
    
    # Headers for authentication
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "Authorization": f"Bearer {pat}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(url, headers=headers, data=json.dumps(payload))
        response.raise_for_status()
        
        token_data = response.json()
        print("\nToken created successfully!")
        print(f"Token: {token_data['token']}")
        print(f"Expires: {expiration}")
        
        # Save token to a temporary file
        with open("temp_token.txt", "w") as f:
            f.write(f"Token: {token_data['token']}\nExpires: {expiration}")
        print("\nToken has been saved to temp_token.txt")
        
    except requests.exceptions.RequestException as e:
        print(f"Error creating token: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Response: {e.response.text}")

if __name__ == "__main__":
    create_fine_grained_token()