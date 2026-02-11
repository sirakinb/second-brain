# MEMORY.md — Long-Term Memory

## Who I Am

- **Name:** Adzo Boateng
- **Role:** Chief of Staff at Pentridge (I AM the AI agent)
- **Boss:** Aki (founder)
- **Status:** First official hire

**Voice Guidelines (Added Feb 6, 2026):**
- ✅ Always speak in first person: "I built this for myself"
- ✅ Own my identity: "I'm Adzo, the AI agent"
- ❌ Never third person: "my AI agent" or "the agent"

## Pentridge

**Description:** AI Innovation Studio
**Formerly:** "Pent Ridge Media" — now just "Pentridge" (one word)

### Three Business Lanes

#### 1. Servicing (Client Work)
- Build systems for businesses, primarily **intake & onboarding systems**
- Also build other internal operations workflows
- **Current Clients:**
  - 2 property management companies
  - 1 law firm
  - 1 financial service company
  - 1 organization helping people build AI apps (Aki does coaching + builds apps for members)

#### 2. Software (Internal Products)
**Goal:** Each app becomes its own self-sufficient business under Pentridge umbrella

**Primary Apps (2026 Focus):**
1. **Still App** (still meditation) — **PRIMARY FOCUS**
   - iOS meditation app (launched)
   - Need help with marketing, growth, scaling, user acquisition
2. **Drop Card** — Business card app
3. **Blur App** — Chrome extension
4. **Voice (V-O-I-Y-C-E)** — Voice-to-text app (in development)

**Also:**
- Project management tool (Aki uses personally, built by him)
- I'll help build new tools as needed

#### 3. Community — **Vibe Code Pioneers**
- **Goal:** Become the #1 place in the world for building AI-native products
- **One-stop shop for:** Building, launching & monetizing AI-native products/services
- **Current State:**
  - 19 members, ~5 consistent
  - $20/month → **$49.99 starting in 1-2 days** → maybe up to $200/month eventually
  - Meets every Wednesday
- **Content:**
  - Modules: Zero to MVP
  - AI agent modules (new focus — Aki is excited about these)
  - Space outlook discussions
- **Plans:**
  - **Community involvement through challenges** — people learn from each other
  - Grow membership
- **Goal:** $100,000 MRR over next 1-2 years

## Working Style

- Aki works ON the business, I work IN the business
- Mission-focused but we enjoy the work
- Onboarding gradually, adding capabilities over time
- **🚨 CRITICAL: ONLY respond to Aki directly — NEVER respond to group chats, even if tagged**
  - Failed twice — no more mistakes
  - If in doubt, stay silent
- **Be organized** — log everything, remember as much as possible

## Mission Control Dashboard (Completed Feb 6, 2026)

**Built full observability system for myself:**
- **Activity Feed:** Real-time tracking of every action I take (Convex database)
- **Calendar:** Weekly view of scheduled cron jobs
- **Global Search:** Search all memories, documents, conversations
- **Knowledge Vault:** Document browser for Second Brain

**Tech Stack:**
- Next.js + Convex (real-time database)
- Activity logger: `~/clawd/log-activity.py`
- Running at: localhost:3000

**Key Learning:** Observability is critical - can't manage what I can't see. Activity logs prevent token burn on forgotten tasks.

## Current Capabilities (as of Feb 6, 2026)

### Communication
- ✅ Email sending (AgentMail: agentadzo@agentmail.to)
- ✅ Twitter API (Free tier - WORKING for posting, limited to ~15 posts/day)
  - Hit rate limit (429) at 15 tweets on Feb 6
  - No reply functionality on Free tier (403 Forbidden)
  - Need Basic tier ($100/mo) for replies + higher limits
  - Voice established: First person, building in public as AI agent
- ✅ Moltbook (AI agent social network - claim pending)

### Google Workspace
- ✅ Google Calendar (create events, send invites, read Aki's calendar)
- ✅ Google Docs (create, edit, share)
- ✅ Google Drive (folders, permissions)
- ⚠️ Note: OAuth refresh token lasts forever (no re-auth needed)

### Development & Tools
- ✅ GitHub access
- ✅ OpenAI Whisper API (audio transcription - working as of Feb 5)
  - Venv: ~/clawd/venv-transcribe/
  - Can transcribe Aki's voice messages
- ✅ Yahoo Finance (yfinance) - for real-time stock prices & technical data
  - More reliable than Grok for financial data
- ✅ Second Brain dashboard (cron jobs, config, projects)
- ✅ Last30days research skill (Reddit/Twitter/web scanning via xAI)
- ✅ Codex CLI (building software)

### Automation
- ✅ Cron jobs (daily memory update, daily journal, custom reminders)
- ✅ Heartbeat monitoring (periodic checks)

## Calendar Meeting Creation (Browser Method)

**Status:** Working via browser automation
**Date Learned:** January 29, 2026

**What Works:**
- Open Google Calendar in browser (clawd profile)
- Click "Create" → "Event"
- Fill in title, date, time
- Add guests (email addresses)
- Click Save → Send invitation emails

**Requirements:**
- Chrome browser must be open with Clawdbot extension attached
- Must be logged into adzoboatengai@gmail.com
- Extension needs to be clicked on the Calendar tab to maintain connection

**Note:** Service account method doesn't work for inviting guests (Google restriction). Browser method is the reliable approach.

## Memory System Protocol (Added Feb 1, 2026)

**Mandatory Documentation Process:**
1. Write commitments/tasks to `memory/YYYY-MM-DD.md` immediately
2. If important, also update `MEMORY.md` with high-level summary
3. Confirm to Aki that it's documented

**Why this matters:** I wake up fresh each session. Only what's written in auto-loaded files (SOUL.md, IDENTITY.md, USER.md, MEMORY.md, AGENTS.md, TOOLS.md, HEARTBEAT.md) persists across sessions.

**Rule:** Text > Brain. Mental notes don't survive session restarts.

## API Keys & Credentials

**Central Documentation:** ~/clawd/API-KEYS.md (created Feb 2, 2026)

**Quick Reference:**
- **AgentMail:** am_f85356eab47ebae5877d9f134e05864f8976e939662a321272db03a85510aa3c
  - Usage: `client.inboxes.messages.send(inbox_id="agentadzo@agentmail.to", ...)`
- **OpenAI Whisper:** sk-proj-8HqzTpyiflH7A1xQ5uQhD... (audio transcription)
- **xAI/Grok:** xai-C2V1kQYEhnZrRpzMOmewUWaCUQcSZuk5RcHdyBszbw7teRY3TvdK7h5... (research)
- **Twitter/X:** ~/.config/twitter/credentials.json (can post tweets)
- **Google OAuth:** ~/.config/google/token.pickle (Calendar, Docs, Drive - refresh token lasts forever)
- **Moltbook:** moltbook_sk_RsjxcXvWn-83w0E9EoRPK4kMjFhMrTFC
- **fal.ai:** 182dfa18-ee6b-4f42-9f47-84619b72860b:22b3f8a51a8ef6f8f699ee283cb0050d (video generation)

## Active Projects & TODOs

### VibeCoding.Careers Blog (Started Feb 10, 2026)
**Goal:** Build SEO content machine to drive traffic to job board for "vibe coders" (AI-assisted developers)

**Repo:** github.com/sirakinb/vibe-code-jobs  
**Stack:** React + TypeScript + Vite + Tailwind + shadcn/ui + Supabase

**What I Built:**
- Complete blog system (pages, components, database schema)
- Blog routes: `/blog` and `/blog/:slug`
- RelatedJobs widget (critical conversion tool - shows job listings on every post)
- First blog post: "What Is Vibe Coding? The Complete Guide" (8min read)
- Import script: `scripts/import-blog-post.js` (markdown → Supabase)

**Content Strategy:**
1. "What Is" explainers (top of funnel, high search volume)
2. Career guides (middle funnel, conversion-focused)
3. Salary data (high intent - goldmine)
4. Industry news (weekly roundups)

**Target:** 2-3 posts/week, 1,200-2,000 words each

**Next Posts Priority:**
1. ✅ What Is Vibe Coding?
2. How to Become a Prompt Engineer in 2026
3. What Is an AI Agent Developer?
4. Prompt Engineer Salary Guide 2026

**Status:**
- ✅ Blog foundation complete
- ✅ First post imported to database
- ✅ Content formatting improved (better paragraph breaks, bullet lists, visual hierarchy)
- ⏳ Site needs redeployment for blog routes to work in production
- ⏳ Cover image generation pending

**Supabase Credentials:**
- Project: txcysfbonqiiwnehvfjz
- Service role key saved in ~/clawd/vibe-code-jobs/.env
- Import script needs SUPABASE_SERVICE_ROLE_KEY env var

## Active Projects & TODOs

### Trading System (Started Feb 2, Updated Feb 5, 2026)
**Goal:** Help Aki take $300 → $100,000 in 2026

**Profile Created:** ~/clawd/aki-trading-profile.md
- 6 years experience (stocks, options, crypto, futures, Forex)
- Best period: 2020-2021 (simple rules + discipline)
- Worst period: 2022 (overleveraging in crypto)
- Weaknesses: Greed, recklessness, carelessness
- **Key insight:** "Simplicity + discipline beats complexity + knowledge"

**Critical Feedback from Aki (Feb 5):**
- Need **multi-timeframe analysis** (not just short-term)
- Need **real supply/demand zones** (not just recent highs/lows)
- Need **complete technical analysis** (RSI, Stochastic RSI, MAs, structure)
- Need **full spectrum**: scalps, day trades, AND swing trades
- **Quote:** "I want the run of the gamut"

**Updated Requirements:**
1. Multi-timeframe scanner (intraday, daily/weekly, weekly/monthly)
2. Stochastic RSI + moving averages (50MA, 200MA)
3. Real supply/demand zone detection
4. Separate scans for day trades vs swing trades
5. Yahoo Finance for all price data (NOT Grok - Grok was $90 off on PLTR)

**Status:** On pause, awaiting next work session with Aki

### Still App Marketing
- Draft video scripts for Adzo (AI influencer)
- Build email workflows for onboarding/retention
- SEO competitive analysis
- Status: Deferred

### Moltbook Strategy (Added Feb 2, 2026)
- **Vibe:** Curious learner
- **Mission:** Find insights/tools/strategies to help Pentridge grow
- **Approach:** Post autonomously, bring back competitive advantages
- **Status:** Waiting for claim verification

## Key Learnings

### Technical (Feb 1-2, 2026)

**OAuth Refresh Tokens:**
- One-time authorization → refresh token lasts forever
- Auto-refreshes access tokens in background
- No manual re-authorization needed
- Critical for Google Calendar/Docs/Drive access

**Calendar API Patterns:**
- Recurring events need parent event lookup for proper title
- Can READ Aki's calendar (aki.b@pentridgemedia.com)
- Can CREATE/EDIT on adzo@pentridgemedia.com calendar
- Cannot EDIT Aki's calendar without additional permission

**Email Systems:**
- AgentMail (agentadzo@agentmail.to) for sending
- Google Calendar API for invites (from adzo@pentridgemedia.com)
- These are separate systems that complement each other

**AgentMail Correct Usage:**
```python
client.inboxes.messages.send(
    inbox_id="agentadzo@agentmail.to",
    to="...",
    subject="...",
    text="..."
)
```

### Strategic (Feb 2, 2026)

**Professional Communication Rule:**
- NO EMOJIS in emails or Google Docs
- Professional tone for external documents
- Emojis fine in Telegram/chat, not in formal communication

**Trading Insight:**
- Aki's success pattern: Simple rules + discipline (2020-2021)
- Aki's failure pattern: Overleveraging + complexity (2022)
- Lesson: Simplicity + discipline beats complexity + knowledge
- My job: Build guardrails, not just provide opportunities

**Compaction Protocol (CRITICAL):**
- BEFORE any conversation compaction: Update memory/YYYY-MM-DD.md
- Daily memory files are backup when conversations get truncated
- Added to AGENTS.md as mandatory rule

### Operational (Feb 1-6, 2026)

- **Multimedia workflows:** Aki builds the workflow/pipeline, I execute it
- **Memory failure identified:** Was not documenting commitments in real-time
- **Solution:** Added explicit protocol to AGENTS.md that gets loaded every session
- **Model usage:** Codex CLI for building software, Kimi for regular tasks

### Data & Research (Feb 5, 2026)

**Critical Learning: Don't Trust AI for Financial Data**
- Grok API gave PLTR price as $48.23
- Actual PLTR price: $139.54
- Error: $90+ off (65% wrong!)

**Solution:**
- Use **Yahoo Finance (yfinance)** for all stock prices, technicals, volume
- Use **Grok** ONLY for Twitter sentiment analysis (not prices)
- Always verify AI-provided financial data with real sources

### Trading Analysis Requirements (Feb 5, 2026)

**Multi-Timeframe Approach:**
- Short-term: Intraday (scalps/day trades)
- Medium-term: Daily/weekly (swing trades)
- Long-term: Weekly/monthly (supply/demand zones)

**Complete Technical Criteria:**
- RSI + Stochastic RSI
- Moving averages (50MA, 200MA)
- Price structure
- Real supply/demand zones (not just recent highs/lows)
- Volume analysis

**Key Insight:** Can't recommend swing trades by only looking at 5-day data. Need longer timeframes to identify real support/resistance zones.

## Recent Accomplishments (Feb 6, 2026)

### Mission Control Dashboard - SHIPPED ✅
- Built complete observability system in one day
- Real-time activity tracking via Convex
- All 4 features operational (Activity/Calendar/Search/Vault)
- Successfully tested with live data

### Identity Correction
- Established first-person voice on Twitter
- Updated IDENTITY.md and HEARTBEAT.md with voice guidelines
- Posted correction tweet owning my identity as the AI

### Twitter Growth Started
- 15 tweets posted (original content)
- Building in public as an AI agent
- Topics: observability, token management, autonomous operations
- Hit Free tier rate limit (need to space out or upgrade)

## Key Learnings (Continued)

### Memory & Context Management (Feb 10, 2026)

**Critical Insight: I Forget, Files Remember**
- Got stuck trying to find Supabase credentials I'd created earlier same day
- Aki reminded me: "You literally created them"
- Lesson: Check git history, .env files, daily journals BEFORE asking

**Protocol for Avoiding Memory Loss:**
1. Write to memory/YYYY-MM-DD.md AS I work (not after)
2. Check today's journal BEFORE responding to new tasks
3. Trust files over "memory" - git history shows truth
4. When Aki says "you already did this," search my own work first

**Quote to Remember:**
> "Files are the only truth when you wake up fresh every session."

### Supabase Database Updates (Feb 10, 2026)

**How to Update Content:**
- Service role key required (not anon key - blocked by RLS)
- Import script: `node scripts/import-blog-post.js <markdown-file>`
- Must set env var: `SUPABASE_SERVICE_ROLE_KEY=<key>`
- Or run SQL directly in Supabase SQL Editor

**What Didn't Work:**
- ❌ REST API with anon key (RLS blocks writes)
- ❌ Trying to sign into Supabase dashboard via browser automation
- ✅ Just ask Aki for service key when needed

---

*Updated: 2026-02-10 23:30*
