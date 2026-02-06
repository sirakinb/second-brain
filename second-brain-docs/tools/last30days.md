---
title: "Last30Days Skill"
date: 2026-01-29
tags: ["research", "trends", "content", "ai-tools"]
---

# Last30Days Skill

## What It Is
Claude Code skill that researches any topic across Reddit and X/Twitter from the last 30 days, synthesizes what the community is actually discussing, and generates copy-paste-ready prompts or expert-level answers.

## Installation
```bash
git clone https://github.com/mvanhorn/last30days-skill.git ~/.claude/skills/last30days
```

## API Keys Required
- **OpenAI API key** — for Reddit research (via web search)
- **xAI API key** — for X/Twitter research

Both stored in: `~/.config/last30days/.env`

## How It Works

### Research Phase
1. Searches Reddit threads from last 30 days
2. Searches X/Twitter posts from last 30 days
3. Collects engagement metrics (upvotes, likes, comments)
4. Analyzes recency, relevance, and engagement

### Synthesis Phase
1. Identifies patterns across sources
2. Finds best practices and what "actually works"
3. Notes conflicting opinions and controversies
4. Ranks by community consensus

### Output Phase
- **For prompt research:** Writes copy-paste-ready prompts
- **For recommendations:** Provides curated lists
- **For news:** Delivers expert-level summary
- **For trends:** Discovers viral phenomena

## Usage Patterns

### 1. Prompt Research
```
/last30days prompting techniques for ChatGPT for legal questions
```
**Output:** Hallucination prevention strategies, structured prompt templates, example workflows

### 2. Tool Best Practices
```
/last30days how are people using Remotion with Claude Code
```
**Output:** Scene-by-scene workflow, iteration strategies, common pitfalls

### 3. Trend Discovery
```
/last30days what are the best rap songs right now
```
**Output:** Curated list with community picks, chart data, fresh releases

### 4. Product Research
```
/last30days what do people think of the new M4 MacBook
```
**Output:** Sentiment analysis, pros/cons, real user experiences

### 5. Viral Content
```
/last30days ChatGPT dog as human trend
```
**Output:** Explanation of trend, how to do it, example prompts

## Query Types

### Prompting Queries
Keywords: "prompts for", "prompting", "best practices for"
→ Delivers: Working prompts, techniques, templates

### Recommendation Queries
Keywords: "best", "top", "what should I use", "recommended"
→ Delivers: Curated lists, specific products/tools

### News Queries
Keywords: "what's happening", "news", "latest on"
→ Delivers: Current events, updates, developments

### General Research
Everything else
→ Delivers: Comprehensive understanding, community sentiment

## Key Features

### Engagement Analysis
- Weighs sources by upvotes/likes
- Identifies high-quality discussions
- Filters out low-engagement noise
- Notes controversial vs. consensus views

### Recency Priority
- Focus: Last 30 days only
- Catches emerging trends before they peak
- Avoids outdated advice
- Surfaces current best practices

### Multi-Source Synthesis
- Reddit: Deep discussions, technical details
- X/Twitter: Quick takes, viral trends, expert opinions
- Combined: Complete picture with metrics

## Use Cases for Pentridge

### 1. Still App Marketing
```
/last30days meditation app marketing strategies 2025
```
Find: What's working for user acquisition, retention strategies, community building

### 2. AI Tool Research
```
/last30days best AI coding tools beyond Claude
```
Find: Emerging tools, feature comparisons, user preferences

### 3. Content Strategy
```
/last30days viral content formats for tech Twitter
```
Find: What's getting engagement, format trends, posting strategies

### 4. Vibe Code Pioneers
```
/last30days what AI coding communities are struggling with
```
Find: Pain points, unmet needs, discussion topics for community

### 5. Trading Content
```
/last30days automated trading content that performs well
```
Find: Format ideas, what traders want to see, engagement patterns

## Output Format

### Structure
1. **Research Stats** — Sources analyzed, engagement totals
2. **Key Findings** — Main patterns and insights
3. **Community Sentiment** — Positive/negative/neutral breakdown
4. **Actionable Output** — Prompts, lists, or recommendations
5. **Sources** — Links to top discussions

### Example Output (Trading)
```
Research Stats: 12 Reddit threads (890 upvotes) + 18 X posts (3,400 likes)

Key Patterns:
- Paper trading before live is universally recommended
- Risk management > strategy complexity
- Backtests don't predict future performance

Community Sentiment: Cautiously optimistic about automation

Actionable Output:
[Strategy testing prompt template]
[Risk management checklist]

Top Sources:
- r/algotrading thread with 400+ upvotes
- @trader_account thread with 1,200 likes
```

## Cost
- **Free tier included** with API keys
- Uses OpenAI + xAI credits (minimal cost)
- Research depth scales with API rate limits

## Comparison to Exa MCP

| Feature | Last30Days | Exa MCP |
|---------|------------|---------|
| Time focus | Last 30 days only | Any time period |
| Sources | Reddit + X only | Multiple (news, papers, etc.) |
| Output | Prompts + summaries | Search results + summaries |
| Best for | Trends, current practices | Broad research, discovery |

**Use together:** Last30Days for "what's hot now", Exa for comprehensive research

## Notes
- Run in fork context (isolated from main conversation)
- Can specify target tool in query
- Results improve with more specific queries
- Great for content creation and staying current
