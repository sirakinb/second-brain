#!/usr/bin/env python3
"""Post to Twitter using OAuth 1.0a User Context."""

import json
import sys
from requests_oauthlib import OAuth1Session

def load_credentials():
    """Load Twitter credentials from config."""
    with open('/Users/adzoboateng/.config/twitter/credentials.json', 'r') as f:
        return json.load(f)

def post_tweet(text: str) -> dict:
    """Post a tweet using Twitter API v2.
    
    Args:
        text: Tweet text (max 280 chars)
        
    Returns:
        API response dict
    """
    creds = load_credentials()
    
    # Create OAuth 1.0a session
    oauth = OAuth1Session(
        creds['api_key'],
        client_secret=creds['api_key_secret'],
        resource_owner_key=creds['access_token'],
        resource_owner_secret=creds['access_token_secret']
    )
    
    # API endpoint for posting tweets
    url = "https://api.twitter.com/2/tweets"
    
    payload = {"text": text}
    
    response = oauth.post(url, json=payload)
    
    if response.status_code == 201:
        data = response.json()
        tweet_id = data['data']['id']
        return {
            "success": True,
            "tweet_id": tweet_id,
            "url": f"https://twitter.com/user/status/{tweet_id}",
            "data": data
        }
    else:
        return {
            "success": False,
            "status_code": response.status_code,
            "error": response.text
        }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: twitter_post.py <tweet_text>")
        sys.exit(1)
    
    tweet_text = sys.argv[1]
    
    if len(tweet_text) > 280:
        print(f"Error: Tweet too long ({len(tweet_text)} chars, max 280)")
        sys.exit(1)
    
    result = post_tweet(tweet_text)
    print(json.dumps(result, indent=2))
    
    sys.exit(0 if result['success'] else 1)
