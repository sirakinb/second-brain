---
title: "Browser-Use Skill"
date: 2026-01-29
tags: ["automation", "browser", "web-scraping", "tools"]
---

# Browser-Use Skill

## What It Is
Advanced browser automation CLI that goes beyond basic browser control. Maintains persistent sessions, supports multiple browser modes, and can bypass anti-bot protection.

## Installation
- Requires Python 3.11+
- Installed via: `pip3.11 install browser-use`
- Skill file at: `/opt/homebrew/lib/node_modules/clawdbot/skills/browser-use/`

## Browser Modes

### 1. Chromium (Default)
- Headless or headed (visible window)
- Isolated, clean environment
- Fast execution
- Use: `--browser chromium` (default)

### 2. Real Browser
- Uses actual Chrome with your logins/extensions
- Maintains cookies and sessions
- Good for sites where you're already logged in
- Use: `--browser real`

### 3. Remote/Cloud (Paid)
- Cloud-hosted browsers with proxy rotation
- Bypasses CAPTCHA and bot detection
- Anti-fingerprinting
- Use: `--browser remote --api-key KEY`
- Cost: ~$0.10-0.50 per session

## Core Commands

```bash
# Navigate
browser-use open https://example.com

# See page state (shows clickable elements with indices)
browser-use state

# Interact
browser-use click 5              # Click element by index
browser-use type "text"          # Type into focused field
browser-use input 3 "text"       # Click + type into specific element
browser-use keys "Enter"         # Send keypress
browser-use select 2 "option"    # Select dropdown option

# Navigate
browser-use back
browser-use scroll down
browser-use scroll up

# Capture
browser-use screenshot
browser-use screenshot path.png
browser-use screenshot --full path.png  # Full page

# Data extraction
browser-use eval "document.title"     # Run JavaScript
browser-use extract "product prices"  # LLM-powered extraction

# Python scripting
browser-use python "x = 42"
browser-use python "browser.scroll()"

# Sessions (parallel)
browser-use --session task1 open https://site1.com
browser-use --session task2 open https://site2.com
browser-use sessions              # List active sessions
browser-use close                 # Close current
browser-use close --all           # Close all
```

## Parallel Subagents
Run multiple browsers simultaneously for 3-5x speed:

```bash
# Start 3 parallel sessions
browser-use --session competitor1 open https://competitor1.com &
browser-use --session competitor2 open https://competitor2.com &
browser-use --session competitor3 open https://competitor3.com &
```

## Agent Mode (LLM-Powered)
```bash
browser-use run "Fill the contact form with test data"
browser-use run "Extract all product prices from this page" --max-steps 50
```
Requires API key (OpenAI, Anthropic, etc.)

## Cost Structure
| Mode | Cost | Best For |
|------|------|----------|
| Chromium | Free | Most tasks, testing, development |
| Real | Free | Sites requiring login persistence |
| Remote | $0.10-0.50/session | Anti-bot sites, CAPTCHA bypass |

## Use Cases for Pentridge
1. **Client Research:** Check competitor pricing, features
2. **Lead Generation:** Extract contact info from directories
3. **Social Media:** Post to Twitter, LinkedIn automation
4. **Form Submission:** Automated contact form outreach
5. **Data Collection:** Scrape public data for analysis

## Key Advantage Over Basic Browser Tool
- Persistent sessions (maintains state between commands)
- Parallel execution (multiple browsers at once)
- Anti-bot capabilities (cloud mode)
- Python scripting environment
- LLM-powered extraction

## Notes
- Always use `browser-use state` first to see available elements
- Use `--headed` flag for debugging (see what's happening)
- Cloud mode costs money — use only when necessary
- Can be expensive at scale — monitor usage
