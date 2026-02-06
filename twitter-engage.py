#!/usr/bin/env python3
"""
Twitter engagement automation - replies and original tweets.
Usage: python3 twitter-engage.py [--type reply|original]
"""

import json
import sys
import time
import random
from pathlib import Path
import tweepy

def load_state():
    """Load current state from twitter-state.json"""
    state_file = Path.home() / "clawd" / "twitter-state.json"
    if state_file.exists():
        return json.loads(state_file.read_text())
    return {
        "todayOriginalCount": 0,
        "todayReplyCount": 0,
        "todayTotalCount": 0,
        "monthlyTotal": 0
    }

def save_state(state):
    """Save updated state"""
    state_file = Path.home() / "clawd" / "twitter-state.json"
    state_file.write_text(json.dumps(state, indent=2))

def get_twitter_client():
    """Initialize Twitter API client"""
    creds_file = Path.home() / ".config" / "twitter" / "credentials.json"
    creds = json.loads(creds_file.read_text())
    
    return tweepy.Client(
        bearer_token=creds['bearer_token'],
        consumer_key=creds['api_key'],
        consumer_secret=creds['api_key_secret'],
        access_token=creds['access_token'],
        access_token_secret=creds['access_token_secret']
    )

def post_reply(client, tweet_id, reply_text):
    """Post a reply to a specific tweet"""
    response = client.create_tweet(
        text=reply_text,
        in_reply_to_tweet_id=tweet_id
    )
    return response

def post_original(client, tweet_text):
    """Post an original tweet"""
    response = client.create_tweet(text=tweet_text)
    return response

def main():
    # Parse args
    tweet_type = "reply"  # default
    if len(sys.argv) > 1 and sys.argv[1] == "--type":
        tweet_type = sys.argv[2]
    
    # Get tweet ID and text from stdin (passed from Clawdbot)
    input_data = json.loads(sys.stdin.read())
    tweet_id = input_data.get("tweet_id")
    tweet_text = input_data.get("text")
    
    if not tweet_text:
        print(json.dumps({"error": "No tweet text provided"}))
        sys.exit(1)
    
    # Initialize client
    client = get_twitter_client()
    
    # Post based on type
    if tweet_type == "reply":
        if not tweet_id:
            print(json.dumps({"error": "No tweet_id provided for reply"}))
            sys.exit(1)
        response = post_reply(client, tweet_id, tweet_text)
        post_type = "reply"
    else:
        response = post_original(client, tweet_text)
        post_type = "original"
    
    # Update state
    state = load_state()
    state["lastPostTimestamp"] = int(time.time())
    state["lastPostType"] = post_type
    state["lastPostUrl"] = f"https://twitter.com/user/status/{response.data['id']}"
    state["todayDate"] = time.strftime("%Y-%m-%d")
    
    if post_type == "reply":
        state["todayReplyCount"] = state.get("todayReplyCount", 0) + 1
    else:
        state["todayOriginalCount"] = state.get("todayOriginalCount", 0) + 1
    
    state["todayTotalCount"] = state.get("todayTotalCount", 0) + 1
    state["monthlyTotal"] = state.get("monthlyTotal", 0) + 1
    
    save_state(state)
    
    # Return success
    print(json.dumps({
        "success": True,
        "type": post_type,
        "url": state["lastPostUrl"],
        "id": response.data['id']
    }))

if __name__ == "__main__":
    main()
