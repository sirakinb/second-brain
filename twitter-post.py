#!/usr/bin/env python3
"""
Smart Twitter posting with media support.
Checks conditions before posting, tracks state.
"""

import json
import tweepy
from datetime import datetime, timezone
import pytz

# Load credentials
with open('/Users/adzoboateng/.config/twitter/credentials.json', 'r') as f:
    creds = json.load(f)

# Load state
with open('/Users/adzoboateng/clawd/twitter-state.json', 'r') as f:
    state = json.load(f)

# Authenticate
client = tweepy.Client(
    bearer_token=creds['bearer_token'],
    consumer_key=creds['api_key'],
    consumer_secret=creds['api_key_secret'],
    access_token=creds['access_token'],
    access_token_secret=creds['access_token_secret']
)

# For media upload (v1.1 API)
auth = tweepy.OAuth1UserHandler(
    creds['api_key'],
    creds['api_key_secret'],
    creds['access_token'],
    creds['access_token_secret']
)
api = tweepy.API(auth)

def check_conditions():
    """Check if conditions are met for posting."""
    eastern = pytz.timezone('America/New_York')
    now = datetime.now(eastern)
    
    # Check active hours (8 AM - 10 PM EST)
    if now.hour < 8 or now.hour >= 22:
        return False, "Outside active hours (8 AM - 10 PM EST)"
    
    # Check time since last post (>3 hours)
    if state['lastPostTimestamp'] > 0:
        last_post = datetime.fromtimestamp(state['lastPostTimestamp'], tz=timezone.utc)
        hours_since = (datetime.now(timezone.utc) - last_post).total_seconds() / 3600
        if hours_since < 3:
            return False, f"Only {hours_since:.1f} hours since last post (need 3+)"
    
    return True, "Conditions met"

def post_tweet(text, media_path=None, reply_to=None):
    """Post a tweet with optional media."""
    media_ids = []
    
    # Upload media if provided
    if media_path:
        media = api.media_upload(media_path)
        media_ids = [media.media_id]
    
    # Post tweet
    if reply_to:
        response = client.create_tweet(
            text=text,
            media_ids=media_ids if media_ids else None,
            in_reply_to_tweet_id=reply_to
        )
    else:
        response = client.create_tweet(
            text=text,
            media_ids=media_ids if media_ids else None
        )
    
    # Update state
    eastern = pytz.timezone('America/New_York')
    now = datetime.now(eastern)
    today = now.strftime('%Y-%m-%d')
    
    if state['todayDate'] != today:
        state['todayDate'] = today
        state['todayPostCount'] = 0
    
    state['lastPostTimestamp'] = datetime.now(timezone.utc).timestamp()
    state['lastPostType'] = 'reply' if reply_to else 'original'
    state['todayPostCount'] += 1
    state['totalPosts'] += 1
    
    # Save state
    with open('/Users/adzoboateng/clawd/twitter-state.json', 'w') as f:
        json.dump(state, f, indent=2)
    
    return response

if __name__ == '__main__':
    can_post, reason = check_conditions()
    print(f"Can post: {can_post}")
    print(f"Reason: {reason}")
    print(f"State: {json.dumps(state, indent=2)}")
