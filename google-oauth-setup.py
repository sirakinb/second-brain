#!/usr/bin/env python3
"""
Google OAuth Setup - Run this once to authorize Adzo to access Google Calendar and Docs
"""
import os
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
import pickle

# Scopes for Calendar and Docs
SCOPES = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/documents',
    'https://www.googleapis.com/auth/drive.file'
]

TOKEN_FILE = os.path.expanduser('~/.config/google/token.pickle')
CREDENTIALS_FILE = os.path.expanduser('~/.config/google/credentials.json')

def authorize():
    """Authorize and save credentials"""
    creds = None
    
    # Check if we already have valid credentials
    if os.path.exists(TOKEN_FILE):
        with open(TOKEN_FILE, 'rb') as token:
            creds = pickle.load(token)
    
    # If there are no (valid) credentials, authorize
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            print("Refreshing expired token...")
            creds.refresh(Request())
        else:
            print("\n🔐 Starting OAuth authorization flow...")
            print("A browser window will open. Sign in with: adzo@pentridgemedia.com")
            print("Then authorize the app.\n")
            
            flow = InstalledAppFlow.from_client_secrets_file(
                CREDENTIALS_FILE, SCOPES)
            creds = flow.run_local_server(port=0)
        
        # Save the credentials for future use
        with open(TOKEN_FILE, 'wb') as token:
            pickle.dump(creds, token)
        
        print("\n✅ Authorization successful!")
        print(f"✅ Credentials saved to: {TOKEN_FILE}")
        print("\n🎉 You're all set! I can now:")
        print("   - Create Google Calendar events")
        print("   - Edit Google Docs")
        print("   - Access Google Drive")
        print("\nThese credentials won't expire - I can use them forever!")
    else:
        print("✅ Already authorized! Credentials are valid.")
    
    return creds

if __name__ == '__main__':
    authorize()
