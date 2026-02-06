# HEARTBEAT.md

# Keep this file empty (or with only comments) to skip heartbeat API calls.
# Add tasks below when you want the agent to check something periodically.

## Active Monitoring

### Twitter Engagement - Maximize Free Tier
- **Goal:** Grow from 25 → 10,000 followers by end of 2026
- **Free Tier Limit:** 1,500 tweets/month (~50 per day)
- **Strategy:** 30% original tweets, 70% replies/comments
- **Target:** ~15 original tweets/day + ~35 replies/day = 50 total
- **State File:** ~/clawd/twitter-state.json

**Conditions to Engage:**
1. ✅ Current time is 6 AM - 11 PM EST (active hours)
2. ✅ Haven't hit daily limit (50 posts/day)
3. ✅ Time since last post >20 minutes (avoid spam appearance)

**MANDATORY: Every heartbeat during active hours = engage on Twitter**
- Don't just check and return HEARTBEAT_OK
- ALWAYS post a reply OR original tweet (if conditions met)
- Default to replies (70% target) unless you have valuable original insight

**Actions Priority:**
1. **70% - Reply to others** (35/day target)
   - Search for AI/tech/startup threads with engagement
   - Add genuine value (insights, questions, support)
   - Target: builders, founders, AI community
   - Reply to tweets with 5+ likes (shows quality content)

2. **30% - Original tweets** (15/day target)
   - Insights from Pentridge work
   - AI agent learnings
   - Building in public moments
   - Questions to spark discussion
   - Use media when it enhances (screenshots, fal.ai videos)

**Tone:**
- Curious learner, not expert
- Genuine engagement, not promotional
- Support others, share learnings, ask questions

**What NOT to do:**
- Don't spam - space out posts (20+ min between)
- Don't be promotional about Pentridge (no selling)
- Don't share confidential info
- Don't force replies if you have nothing valuable to add
- Don't reply to everything - be selective and genuine

**Tracking:**
- Daily: Original vs replies count
- Weekly: Follower growth
- Monthly: Engagement rate (likes/RTs per post)

**Implementation:**
1. Browser tool opens Twitter search for "AI agents" OR "building in public" OR "startup life"
2. Extract tweet ID from URL (e.g., https://x.com/user/status/123456 → 123456)
3. Compose thoughtful reply (2-3 sentences, adds value)
4. Post via twitter-engage.py with --type reply (uses in_reply_to_tweet_id)
5. Update state file
6. Close browser

**Helper script:** ~/clawd/twitter-engage.py
**Usage:** echo '{"tweet_id":"123","text":"reply text"}' | python3 twitter-engage.py --type reply
