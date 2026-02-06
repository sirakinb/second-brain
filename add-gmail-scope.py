#!/usr/bin/env python3
"""Add Gmail API scope to existing Google OAuth credentials."""

import os
import pickle
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow

# Updated scopes to include Gmail
SCOPES = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/documents',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/gmail.send',  # Added Gmail send
]

def main():
    creds = None
    token_path = os.path.expanduser('~/.config/google/token.pickle')
    creds_path = os.path.expanduser('~/.config/google/credentials.json')
    
    # Delete existing token to force re-authorization
    if os.path.exists(token_path):
        os.remove(token_path)
        print(f"Removed existing token: {token_path}")
    
    # Run OAuth flow with updated scopes
    flow = InstalledAppFlow.from_client_secrets_file(creds_path, SCOPES)
    creds = flow.run_local_server(port=0)
    
    # Save new credentials
    with open(token_path, 'wb') as token:
        pickle.dump(creds, token)
    
    print(f"\n✅ Successfully authorized with Gmail scope!")
    print(f"Token saved to: {token_path}")
    print(f"\nScopes authorized:")
    for scope in SCOPES:
        print(f"  - {scope}")

if __name__ == '__main__':
    main()
