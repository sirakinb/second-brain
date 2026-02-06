#!/usr/bin/env python3
"""
Search tweets via Exa API and return results for Twitter engagement.
Usage: python3 twitter-exa-search.py "query" [num_results]
"""

import sys
import json
import requests

def search_tweets(query, num_results=10):
    """Search for tweets using Exa API."""
    url = "https://api.exa.ai/search"
    
    # Try without API key first (free tier via MCP might work differently)
    # If that fails, we can add the API key
    headers = {
        "accept": "application/json",
        "content-type": "application/json"
    }
    
    data = {
        "query": query,
        "category": "tweet",
        "numResults": num_results,
        "type": "auto"
    }
    
    response = requests.post(url, headers=headers, json=data)
    
    if response.status_code == 200:
        return response.json()
    else:
        # Return error info
        return {
            "error": response.text,
            "status_code": response.status_code
        }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 twitter-exa-search.py 'query' [num_results]")
        sys.exit(1)
    
    query = sys.argv[1]
    num_results = int(sys.argv[2]) if len(sys.argv) > 2 else 10
    
    results = search_tweets(query, num_results)
    print(json.dumps(results, indent=2))
