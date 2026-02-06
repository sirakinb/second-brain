---
title: "Adzo's Architecture Visualization"
date: 2026-01-29
tags: ["architecture", "system-design", "visualization", "infrastructure"]
---

# Adzo's Architecture Visualization

## Overview
A living, interactive dashboard showing the complete system architecture of the AI assistant (Adzo). Visualizes how components connect, where data flows, and the relationship between systems.

**Location in App:** `/architecture` (built into Second Brain)

---

## System Components

### 1. Core Identity Layer
**Files:** SOUL.md, IDENTITY.md, USER.md

**What it is:**
- **SOUL.md**: Personality, values, behavioral principles
- **IDENTITY.md**: Public persona (name, role, emoji)
- **USER.md**: Aki's profile and preferences

**Location:** `/clawd/SOUL.md`, `/clawd/IDENTITY.md`, `/clawd/USER.md`

**Updates:** Manually when core identity changes

---

### 2. Memory Systems
**Files:** MEMORY.md, daily memory files

**What it is:**
- **MEMORY.md**: Long-term curated memories, learnings, decisions
- **Daily Memory**: Raw logs in `memory/YYYY-MM-DD.md`
- **Heartbeat**: Periodic checks for tasks (optional)

**Location:** 
- `/clawd/MEMORY.md`
- `/clawd/memory/`
- `/clawd/HEARTBEAT.md` (if active)

**Updates:** 
- Daily (automatic 4 AM journals)
- Real-time (during conversations for important concepts)

---

### 3. Communication Hub
**Platform:** Telegram → Clawdbot Gateway

**What it is:**
- Primary channel: Telegram (@sirakinb)
- Gateway: Clawdbot daemon (port 18791)
- Routing: Messages → Session → Response

**Data Flow:**
1. You send message via Telegram
2. Gateway receives and routes to active session
3. I process (read memory, use tools)
4. I update Second Brain docs
5. I reply via Gateway → Telegram

**Status:** Always connected during business hours

---

### 4. Tools & Skills
**Location:** `/opt/homebrew/lib/node_modules/clawdbot/skills/`

**Installed Tools:**

| Tool | Purpose | Status | Cost |
|------|---------|--------|------|
| **browser-use** | Browser automation, anti-bot, parallel | Active | Free (local) / ~$0.10-0.50 (cloud) |
| **Exa MCP** | Semantic web search | Active | 1000 free searches/month |
| **Last30Days** | Reddit/X research | Active | Uses Exa/OpenAI credits |
| **Alpaca** | Trading API | Standby | Trading free / Data ~$9-99/mo |

**API Keys Configured:**
- OpenAI (Exa, Last30Days)
- xAI (X/Twitter search)
- Alpaca (pending account setup)

---

### 5. External APIs
**Connected Services:**
- **GitHub**: Repos, issues, PRs
- **Gmail**: adzoboatengai@gmail.com (app password)
- **Calendar**: Browser-based creation (service account limited)
- **Twitter/X**: Logged in, can post/interact
- **Browser**: Chrome with Clawdbot extension

**Authentication:**
- Stored in Gateway config
- Encrypted at rest
- App passwords (not full credentials)

---

### 6. Document Storage (Second Brain)
**Location:** `/clawd/second-brain-docs/`

**Structure:**
```
second-brain-docs/
├── daily-journals/
│   ├── 2026-01-28.md  (Day 1)
│   └── 2026-01-29.md  (Day 2)
├── tools/
│   ├── browser-use.md
│   ├── exa-mcp.md
│   ├── last30days.md
│   └── alpaca-markets.md
└── welcome.md
```

**Sync:** Pushed to GitHub repo (sirakinb/second-brain)

**Access:** Via Second Brain app at `http://localhost:3000`

---

## Data Flow Diagram

```
┌─────────────┐
│     YOU     │
│  (Telegram) │
└──────┬──────┘
       │ Message
       ▼
┌─────────────┐
│   GATEWAY   │
│  (Clawdbot) │
└──────┬──────┘
       │ Route to Session
       ▼
┌─────────────┐     ┌──────────────┐
│    ADZO     │◄────┤   MEMORY     │
│  (Processing)│     │   SYSTEM     │
└──────┬──────┘     └──────────────┘
       │
       ├──────────► TOOLS (browser-use, Exa, etc.)
       │
       ├──────────► EXTERNAL APIs (GitHub, Gmail, etc.)
       │
       ▼
┌─────────────┐
│  SECOND     │
│   BRAIN     │
│  (Storage)  │
└──────┬──────┘
       │ Update
       ▼
┌─────────────┐
│     YOU     │
│  (Response) │
└─────────────┘
```

---

## Viewing the Architecture

### In Second Brain App:
1. Run the app: `npm run dev`
2. Navigate to: `http://localhost:3000/architecture`
3. See live visualization with:
   - Component status (active/idle/connected)
   - File paths
   - Real-time clock
   - Session info
   - Storage stats

### Status Indicators:
- **🟢 Active**: Currently in use
- **🔵 Connected**: Linked but idle
- **🟡 Idle/Standby**: Available but not active

---

## Evolution Over Time

This architecture is **living** — it evolves as we:
- Add new skills/tools
- Change workflows
- Update integrations
- Add new storage locations

**Updates happen:**
- When new tools installed (auto-reflect in architecture)
- When storage structure changes
- When new APIs connected
- When significant system changes occur

---

## Next Architecture Additions

Potential future components:
- **Trading Dashboard** (Alpaca integration)
- **Client Project Tracker** (for servicing lane)
- **Vibe Code Analytics** (community metrics)
- **Still App Metrics** (marketing/growth data)
- **Automated Pipeline Visualizer** (CI/CD, deployments)

---

*Architecture visualization created: January 29, 2026*
*Purpose: Transparency and system understanding*
