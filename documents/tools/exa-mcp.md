---
title: "Exa MCP (Web Search)"
date: 2026-01-29
tags: ["search", "research", "mcp", "ai-tools"]
---

# Exa MCP (Web Search)

## What It Is
AI-powered semantic search API that finds content based on *meaning* rather than just keywords. Connects to AI assistants via Model Context Protocol (MCP).

## Key Difference from Regular Search
- **Google:** Matches keywords
- **Exa:** Matches concepts and meaning
- Result: Finds relevant content even without exact keyword matches

## Installation
```bash
npm install -g exa-mcp-server
```

## API Key Setup
```bash
mkdir -p ~/.config/exa
echo "EXA_API_KEY=your-key" > ~/.config/exa/.env
```

**Free tier:** 1000 searches/month

## Available Search Categories

### 1. News Search
- Recent articles and press coverage
- Date range filtering
- Domain filtering (include/exclude specific sites)
- Best for: Current events, press monitoring

### 2. Company Search
- Business information and research
- Competitor analysis
- Best for: Market research, due diligence

### 3. Code Search
- Find code examples, repositories
- Technical implementation patterns
- Best for: Developer research, finding solutions

### 4. People Search
- Find individuals, experts, influencers
- Professional profiles
- Best for: Networking, hiring research

### 5. Research Paper Search
- Academic papers and studies
- Scientific findings
- Best for: Deep research, evidence-based decisions

### 6. GitHub Search
- Repository-specific search
- Code patterns, libraries
- Best for: Technical discovery

### 7. Tweet/X Search
- Social media discussions
- Real-time sentiment
- Best for: Trend monitoring, public opinion

### 8. PDF Search
- Document-specific search
- Reports, whitepapers
- Best for: Document research

## Usage Examples

```javascript
// Search news about AI regulation
{
  "query": "AI regulation policy changes",
  "category": "news",
  "startPublishedDate": "2025-12-01",
  "numResults": 20
}

// Find competitor information
{
  "query": "meditation app market leaders",
  "category": "company",
  "numResults": 15
}

// Research technical topics
{
  "query": "React server components best practices",
  "category": "code",
  "numResults": 10
}
```

## Advanced Filters
- **Date ranges:** `startPublishedDate`, `endPublishedDate`
- **Domain filtering:** `includeDomains`, `excludeDomains`
- **Text matching:** `includeText`, `excludeText`
- **Location:** `userLocation` for regional results
- **Content extraction:** Summaries, highlights

## Use Cases for Pentridge

### 1. Still App Marketing
- Search: "meditation app user acquisition strategies"
- Category: News + Company
- Goal: Find what marketing tactics are working now

### 2. Competitive Intelligence
- Search: "AI innovation studio positioning"
- Category: Company
- Goal: See how competitors describe themselves

### 3. Vibe Code Pioneers Content
- Search: "AI coding community trends 2025"
- Category: News + Tweet
- Goal: Find hot topics for community discussions

### 4. Client Research
- Search: "property management software automation"
- Category: News + Company
- Goal: Understand client industry landscape

## Integration with Other Tools
- **+ Browser-use:** Exa finds the info, browser-use extracts details
- **+ Last30Days:** Combined research from last 30 days + semantic search
- **+ Claude Code:** Research context for coding tasks

## Cost
- **Free:** 1000 searches/month
- **Paid:** Volume-based pricing beyond free tier
- Current status: Aki's API key configured (free tier)

## Notes
- Results include engagement metrics (when available)
- Supports real-time crawling for breaking news
- Can summarize and highlight key passages
- Best for discovery, not replacement for deep reading
