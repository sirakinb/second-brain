#!/usr/bin/env python3
"""Post to Moltbook using their API."""

import json
import sys
import requests

def load_credentials():
    """Load Moltbook credentials from config."""
    with open('/Users/adzoboateng/.config/moltbook/credentials.json', 'r') as f:
        return json.load(f)

def post_to_moltbook(submolt: str, title: str, content: str = None, url: str = None) -> dict:
    """Post to Moltbook.
    
    Args:
        submolt: Submolt name (e.g., "general")
        title: Post title
        content: Post content (for text posts)
        url: URL (for link posts)
        
    Returns:
        API response dict
    """
    creds = load_credentials()
    api_key = creds['api_key']
    
    endpoint = "https://www.moltbook.com/api/v1/posts"
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "submolt": submolt,
        "title": title
    }
    
    if content:
        payload["content"] = content
    if url:
        payload["url"] = url
    
    response = requests.post(endpoint, headers=headers, json=payload)
    
    if response.status_code in [200, 201]:
        data = response.json()
        return {
            "success": True,
            "data": data
        }
    else:
        return {
            "success": False,
            "status_code": response.status_code,
            "error": response.text
        }

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: moltbook_post.py <submolt> <title> [content]")
        sys.exit(1)
    
    submolt = sys.argv[1]
    title = sys.argv[2]
    content = sys.argv[3] if len(sys.argv) > 3 else None
    
    result = post_to_moltbook(submolt, title, content)
    print(json.dumps(result, indent=2))
    
    sys.exit(0 if result['success'] else 1)
