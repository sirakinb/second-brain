# Multimodal Tools Integration

## Configuration
ELEVENLABS_API_KEY=sk_ac1a337d47c4417a682b47decd3490ac15371f490255db29
FAL_API_KEY=182dfa18-ee6b-4f42-9f47-84619b72860b:22b3f8a51a8ef6f8f699ee283cb0050d
GEMINI_API_KEY=AIzaSyCFfdSWfMcuk1tnmuxK1NBsHiXPPc6xp3s
RUNWAY_API_KEY=key_e1a189f85b85d902b35bbb1da7d0e95528698a9c010b5b6c4833e77df439649d87e6c63f756ce279a20ca921b2b992058d5adbb86be255e8cf72b1ca2abdb566
HEYGEN_API_KEY=sk_V2_hgu_kiPpZrDTTlG_2vJ24fgfYKFTcXsbkGIqOixpBNtAh8zX

## Setup Status
- [x] ElevenLabs API configured (voice cloning pending upgrade)
- [ ] fal.ai image generation (needs credits)
- [ ] fal.ai video generation (needs credits)
- [x] Gemini/NanoBanana image generation ✅ WORKING
  - [x] Nano Banana Flash (gemini-2.5-flash-image)
  - [x] Nano Banana Pro (gemini-3-pro-image-preview)
- [x] Usage tracking system ✅ IMPLEMENTED
- [ ] Voice toggle system (pending voice cloning)
- [x] Runway API configured (direct access)
- [x] HeyGen API configured (AI avatars)

## Available Commands

### Image Generation
```
/multimodal image "prompt here" flash    # Fast, good quality
/multimodal image "prompt here" pro      # Higher quality, slower
```

### Video Generation
```
/multimodal video "prompt here" runway   # Cinematic video
/multimodal video "prompt here" heygen   # AI avatar video
```

### Voice Mode
```
/voice on     # Enable voice responses (when voice cloned)
/voice off    # Disable voice responses
```

### Usage Tracking
```
/usage        # Show API usage dashboard
```

## Image Models

### Nano Banana Flash
- **Model:** `gemini-2.5-flash-image`
- **Speed:** Fast (~5-10 seconds)
- **Quality:** Good for drafts, testing
- **Cost:** Included with Gemini API

### Nano Banana Pro
- **Model:** `gemini-3-pro-image-preview`
- **Speed:** Slower (~15-30 seconds)
- **Quality:** Better details, final assets
- **Cost:** Included with Gemini API

## Video Models

### Runway (Direct API)
- **Best for:** Cinematic shots, camera movements
- **Style:** Professional, film-like
- **Cost:** Per video generation
- **Status:** API configured, ready to test

### HeyGen (AI Avatars)
- **Best for:** Talking head videos, explainers
- **Style:** Realistic AI avatars
- **Cost:** Per video generation
- **Status:** API configured, ready to test
- **Note:** Can create avatar from photos

## Usage Dashboard
**Location:** `http://localhost:3000/usage`

Tracks:
- OpenAI (tokens, cost)
- Gemini/NanoBanana (images generated)
- fal.ai (images/videos when credited)
- ElevenLabs (characters, when active)
- Exa MCP (searches)
- Browser-Use (sessions)

## Cost Estimates

| Service | Unit Cost | Notes |
|---------|-----------|-------|
| Nano Banana Flash | Free | Included with Gemini |
| Nano Banana Pro | Free | Included with Gemini |
| Runway | ~$0.50/video | High quality cinematic |
| HeyGen | ~$0.50-3/video | Depends on length/avatar |
| fal.ai (Flux) | ~$0.003/image | Cheapest option |
| ElevenLabs | ~$0.30/1K chars | After free tier |

## Next Steps
1. Test Runway video generation
2. Test HeyGen avatar creation
3. Add fal.ai credits for backup image generation
4. Upgrade ElevenLabs for voice cloning (optional)
5. Build post assembly workflow (multi-image, video clips)

## File Locations
- **Usage tracker:** `/clawd/lib/usage_tracker.py`
- **Multimodal CLI:** `/clawd/bin/multimodal.py`
- **Config:** `/clawd/.env.multimodal`
- **Dashboard:** `app/usage/page.tsx` (Second Brain)
