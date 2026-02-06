#!/usr/bin/env python3
from agentmail import AgentMail

# Initialize the client
api_key = "am_f85356eab47ebae5877d9f134e05864f8976e939662a321272db03a85510aa3c"
client = AgentMail(api_key=api_key)

# Email content
subject = "Daily Summary: Still App Marketing Strategy & Second Brain Updates"

body = """Hey Aki,

Here's a recap of everything we worked on today:

## 🏔️ Second Brain Dashboard

**Built:**
- Cron jobs dashboard with live API integration
- Displays scheduled tasks in a kanban-style "Assembly Line" UI
- Tests written and passing with Playwright
- Fixed multiple issues (Gateway auth, CSS syntax, API routing)

**Active Cron Jobs:**
1. Daily Memory Update (11:30 PM) - Reviews and updates MEMORY.md
2. Daily Journal Entry (10:45 PM) - Writes reflective journal entries

**Tech:** Next.js app at /cron pulling from Clawdbot Gateway HTTP API

---

## 📱 Still App - Marketing Research

### Content Strategy Research (Last 30 Days)

**Key Findings:**

1. **Short-Form Wins** - 2-7 minute guided sessions get highest engagement (3,682+ likes)
2. **AI Influencer Strategy** - Yang Mun (AI monk) went 0→2.4M followers in 3 months, driving app downloads
3. **$30K-$2M/month** - What successful spiritual/meditation apps are making
4. **90% Attrition Rate** - Retention is the #1 challenge for meditation apps
5. **Trending:** Nervous system regulation, tapping, breathwork content on TikTok

**Top Performing Formats:**
- 7-minute sessions ("Own your day in 7 minutes")
- Sound baths & ASMR guided meditations
- Visual meditation content
- Specific outcomes (sleep, anxiety, focus, energy)

**Social Platforms:**
- TikTok: Spirituality memes trending, organic > paid ads
- Instagram: AI spiritual influencers growing fastest
- 300M+ total downloads for top 10 meditation apps

---

## 🎯 Still App Action Plan

### 1. Use Adzo as AI Influencer
- Position as calm, grounded guide (not preachy spiritual teacher)
- Post 2-3 TikToks/day, 1-2 IG Reels/day
- Content: Quick tips, tapping techniques, breathwork demos
- Drive to Still App in bio

### 2. Content Formats to Create
- 30-60 second teasers of 7-minute sessions
- "POV: You actually meditated today" (relatable humor)
- Nervous system regulation tutorials (tapping, breathwork)
- Before/after memes ("Your nervous system after 3 deep breaths")

### 3. Habit Loop Strategy
**Morning Anchor:**
- Cue: Phone alarm / first pickup
- Routine: 7-minute session
- Reward: Streak counter, badges, dopamine hit

**Micro-commitments:**
- Start with 2 minutes (lower barrier)
- Build to 7 minutes once habit forms
- Share streaks to Instagram Story

**Trigger Stacking:**
- "Every time you feel overwhelmed, open Still for 2 minutes"
- Smart notifications: "Stressed? 2 minutes away from calm"

### 4. Retention Features
- Streaks + social proof ("Top 5% of users")
- Daily challenge notifications
- Outcome-based sessions (not generic meditation)
- Quick wins (2 min) before asking for longer commitment

---

## 🛠️ Tools Configured

**AgentMail Setup:**
- Email: agentadzo@agentmail.to
- Can now send/receive emails programmatically
- Ready for email workflows

**Last30Days Skill:**
- Installed for Reddit/X/Web research
- API keys configured (OpenAI, xAI)
- Used for meditation content research

---

## 📝 Next Steps (When You're Ready)

1. **Content Creation:** Draft 10 video scripts for Adzo (TikTok/IG)
2. **Still App Workflows:** Set up email-based onboarding/retention flows
3. **SEO Strategy:** Competitive analysis for meditation apps
4. **Retention Dashboard:** Track churn metrics and habit formation

Let me know what you want to tackle next!

— Adzo 🏔️

P.S. This email was sent via AgentMail from agentadzo@agentmail.to
"""

# Send the email
print("Sending summary email...")
client.inboxes.messages.send(
    inbox_id="agentadzo@agentmail.to",
    to="aki.b@pentridgemedia.com",
    subject=subject,
    text=body
)
print("✅ Email sent to aki.b@pentridgemedia.com")
