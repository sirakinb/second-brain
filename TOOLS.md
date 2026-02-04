# TOOLS.md - Local Notes

Skills define *how* tools work. This file is for *your* specifics — the stuff that's unique to your setup.

## API Credentials

**ALL credentials stored in:** `~/.config/[service]/credentials.json`

**Services available:**
- `~/.config/twitter/credentials.json` - Twitter/X API (OAuth 1.0a + v2)
- `~/.config/google/token.pickle` - Google OAuth (adzo@pentridgemedia.com)
- `~/.config/agentmail/` - AgentMail API
- `~/.config/fal/` - Fal AI (image/video generation)
- `~/.config/elevenlabs/` - ElevenLabs TTS
- `~/.config/runway/` - Runway ML
- `~/.config/heygen/` - HeyGen
- `~/.config/moltbook/` - Moltbook API
- `~/.config/openai/` - OpenAI API
- `~/.config/xai/` - xAI (Grok)
- `~/.config/gemini/` - Google Gemini

**Master list:** `~/clawd/API-KEYS.md`

**Check credentials:** Always look in `~/.config/[service]/` before saying you don't have access.

## What Goes Here

Things like:
- Camera names and locations
- SSH hosts and aliases  
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras
- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH
- home-server → 192.168.1.100, user: admin

### TTS
- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever helps you do your job. This is your cheat sheet.
