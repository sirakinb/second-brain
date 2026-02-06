#!/usr/bin/env python3
"""
Multimodal CLI - Generate images and videos
"""
import sys
import os
sys.path.insert(0, '/Users/adzoboateng/clawd/lib')

from usage_tracker import log_fal_image, log_fal_video

def generate_image(prompt: str, model: str = "flux-dev"):
    """Generate image using fal.ai"""
    import fal_client
    
    print(f"🎨 Generating image with {model}...")
    print(f"Prompt: {prompt}")
    
    try:
        # Submit request to fal.ai
        result = fal_client.subscribe(
            f"fal-ai/{model}",
            arguments={
                "prompt": prompt,
                "image_size": "landscape_16_9"
            },
            with_logs=True
        )
        
        # Log usage
        log_fal_image(prompt, model)
        
        image_url = result["images"][0]["url"]
        print(f"✅ Image generated!")
        print(f"URL: {image_url}")
        return image_url
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def generate_video(prompt: str, model: str = "runway-gen3"):
    """Generate video using fal.ai (Runway)"""
    import fal_client
    
    print(f"🎬 Generating video with {model}...")
    print(f"Prompt: {prompt}")
    
    try:
        # Map model names to fal.ai endpoints
        model_map = {
            "runway-gen3": "fal-ai/runway-gen3",
            "luma": "fal-ai/luma",
            "kling": "fal-ai/kling"
        }
        
        endpoint = model_map.get(model, "fal-ai/runway-gen3")
        
        result = fal_client.subscribe(
            endpoint,
            arguments={
                "prompt": prompt,
                "duration": 5  # seconds
            },
            with_logs=True
        )
        
        # Log usage
        log_fal_video(prompt, model)
        
        video_url = result["video"]["url"]
        print(f"✅ Video generated!")
        print(f"URL: {video_url}")
        return video_url
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def main():
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python3 multimodal.py image 'prompt here' [model]")
        print("  python3 multimodal.py video 'prompt here' [model]")
        print("")
        print("Image models: flux-dev (default), flux-pro, stable-diffusion-xl")
        print("Video models: runway-gen3 (default), luma, kling")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "image":
        prompt = sys.argv[2]
        model = sys.argv[3] if len(sys.argv) > 3 else "flux-dev"
        generate_image(prompt, model)
    
    elif command == "video":
        prompt = sys.argv[2]
        model = sys.argv[3] if len(sys.argv) > 3 else "runway-gen3"
        generate_video(prompt, model)
    
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)

if __name__ == "__main__":
    main()
