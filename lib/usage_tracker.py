"""
API Usage Tracker
Logs all API calls with costs and metadata
"""
import json
import os
from datetime import datetime
from typing import Dict, Any, Optional
import pathlib

class UsageTracker:
    def __init__(self, storage_path: str = "/Users/adzoboateng/clawd/second-brain-docs/usage"):
        self.storage_path = pathlib.Path(storage_path)
        self.storage_path.mkdir(parents=True, exist_ok=True)
        self.daily_file = self.storage_path / f"{datetime.now().strftime('%Y-%m-%d')}.json"
        
    def log_usage(self, service: str, operation: str, cost: float = 0.0, 
                  metadata: Optional[Dict[str, Any]] = None):
        """Log an API usage event"""
        entry = {
            "timestamp": datetime.now().isoformat(),
            "service": service,
            "operation": operation,
            "cost_usd": cost,
            "metadata": metadata or {}
        }
        
        # Load existing daily log
        if self.daily_file.exists():
            with open(self.daily_file, 'r') as f:
                data = json.load(f)
        else:
            data = {"entries": [], "daily_total": 0.0}
        
        # Add entry
        data["entries"].append(entry)
        data["daily_total"] += cost
        
        # Save
        with open(self.daily_file, 'w') as f:
            json.dump(data, f, indent=2)
        
        return entry
    
    def get_daily_summary(self, date: Optional[str] = None) -> Dict:
        """Get usage summary for a specific date"""
        if date is None:
            date = datetime.now().strftime('%Y-%m-%d')
        
        file_path = self.storage_path / f"{date}.json"
        if not file_path.exists():
            return {"entries": [], "daily_total": 0.0}
        
        with open(file_path, 'r') as f:
            return json.load(f)
    
    def get_service_summary(self, days: int = 30) -> Dict[str, Dict]:
        """Get aggregated usage by service over N days"""
        summary = {}
        
        for i in range(days):
            date = (datetime.now() - __import__('datetime').timedelta(days=i)).strftime('%Y-%m-%d')
            daily_data = self.get_daily_summary(date)
            
            for entry in daily_data.get("entries", []):
                service = entry["service"]
                if service not in summary:
                    summary[service] = {
                        "total_cost": 0.0,
                        "total_calls": 0,
                        "operations": {}
                    }
                
                summary[service]["total_cost"] += entry["cost_usd"]
                summary[service]["total_calls"] += 1
                
                op = entry["operation"]
                if op not in summary[service]["operations"]:
                    summary[service]["operations"][op] = {"count": 0, "cost": 0.0}
                summary[service]["operations"][op]["count"] += 1
                summary[service]["operations"][op]["cost"] += entry["cost_usd"]
        
        return summary

# Global tracker instance
tracker = UsageTracker()

# Convenience functions for common APIs
def log_openai_usage(operation: str, tokens: int, model: str = "gpt-4"):
    """Log OpenAI API usage"""
    # Approximate costs (varies by model)
    costs_per_1k = {
        "gpt-4": 0.03,
        "gpt-4-turbo": 0.01,
        "gpt-3.5-turbo": 0.0015,
        "dall-e-3": 0.04  # per image
    }
    cost = (tokens / 1000) * costs_per_1k.get(model, 0.01)
    
    return tracker.log_usage(
        service="OpenAI",
        operation=operation,
        cost=cost,
        metadata={"model": model, "tokens": tokens}
    )

def log_fal_image(prompt: str, model: str = "flux-dev"):
    """Log fal.ai image generation"""
    costs = {
        "flux-dev": 0.003,
        "flux-pro": 0.05,
        "stable-diffusion-xl": 0.002
    }
    cost = costs.get(model, 0.003)
    
    return tracker.log_usage(
        service="fal.ai (Images)",
        operation="image_generation",
        cost=cost,
        metadata={"model": model, "prompt_length": len(prompt)}
    )

def log_fal_video(prompt: str, model: str = "runway-gen3"):
    """Log fal.ai video generation"""
    costs = {
        "runway-gen3": 0.50,
        "luma": 0.30,
        "kling": 0.40
    }
    cost = costs.get(model, 0.50)
    
    return tracker.log_usage(
        service="fal.ai (Video)",
        operation="video_generation",
        cost=cost,
        metadata={"model": model, "prompt_length": len(prompt)}
    )

def log_elevenlabs(characters: int):
    """Log ElevenLabs TTS usage"""
    # ~$0.30 per 1000 characters
    cost = (characters / 1000) * 0.30
    
    return tracker.log_usage(
        service="ElevenLabs",
        operation="text_to_speech",
        cost=cost,
        metadata={"characters": characters}
    )

def log_exa_search(query: str):
    """Log Exa MCP search"""
    return tracker.log_usage(
        service="Exa MCP",
        operation="web_search",
        cost=0.0,  # Free tier
        metadata={"query": query[:100]}
    )

def log_browser_use(cloud_mode: bool = False):
    """Log browser-use session"""
    cost = 0.50 if cloud_mode else 0.0
    
    return tracker.log_usage(
        service="Browser-Use",
        operation="cloud_session" if cloud_mode else "local_session",
        cost=cost,
        metadata={"cloud_mode": cloud_mode}
    )

def log_gemini_image(prompt: str, model: str = "gemini-2.5-flash-image"):
    """Log Gemini/Nano Banana image generation"""
    costs = {
        "gemini-2.5-flash-image": 0.0,  # Free during preview
        "gemini-3-pro-image-preview": 0.0  # Free during preview
    }
    cost = costs.get(model, 0.0)
    
    return tracker.log_usage(
        service="Gemini (Nano Banana)",
        operation="image_generation",
        cost=cost,
        metadata={"model": model, "prompt_length": len(prompt)}
    )

def log_heygen_video(duration: int, model: str = "talking_photo"):
    """Log HeyGen video generation"""
    # HeyGen pricing varies, approximate $0.05 per second
    cost = duration * 0.05
    
    return tracker.log_usage(
        service="HeyGen",
        operation="video_generation",
        cost=cost,
        metadata={"duration_seconds": duration, "model": model}
    )

def log_runway_video(duration: int, model: str = "gen3"):
    """Log Runway video generation"""
    # Runway Gen-3 is ~$0.50 per 5 seconds
    cost = (duration / 5) * 0.50
    
    return tracker.log_usage(
        service="Runway",
        operation="video_generation",
        cost=cost,
        metadata={"duration_seconds": duration, "model": model}
    )

def log_suno_music(duration: int):
    """Log Suno music generation"""
    # Suno pricing varies, approximate $0.10 per 30 seconds
    cost = (duration / 30) * 0.10
    
    return tracker.log_usage(
        service="Suno",
        operation="music_generation",
        cost=cost,
        metadata={"duration_seconds": duration}
    )

# Export functions
__all__ = [
    'tracker',
    'log_openai_usage',
    'log_fal_image',
    'log_fal_video', 
    'log_elevenlabs',
    'log_exa_search',
    'log_browser_use',
    'log_gemini_image',
    'log_heygen_video',
    'log_runway_video',
    'log_suno_music'
]
