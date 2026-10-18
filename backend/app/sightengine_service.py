"""Sightengine GenAI Detection API service.

Calls Sightengine's official commercial endpoint (https://api.sightengine.com/1.0/check.json)
to provide a side-by-side benchmark with our custom FFT model.
"""

import os
import logging
from typing import Optional, Dict, Any
import httpx

logger = logging.getLogger("ai_detector.sightengine")

SIGHTENGINE_URL = "https://api.sightengine.com/1.0/check.json"


async def check_image_with_sightengine(image_bytes: bytes, filename: str = "image.jpg") -> Optional[Dict[str, Any]]:
    """Sends the uploaded image to Sightengine GenAI API if credentials are configured.
    
    Args:
        image_bytes: Raw binary content of the image.
        filename: Original file name.
        
    Returns:
        Dict with keys `prediction` ("real" | "fake"), `confidence` (float 0..1), 
        `ai_generated_score` (float 0..1), or None if credentials are not configured or request fails.
    """
    api_user = os.getenv("SIGHTENGINE_API_USER")
    api_secret = os.getenv("SIGHTENGINE_API_SECRET")

    if not api_user or not api_secret:
        logger.info("Sightengine API credentials not set. Skipping commercial API comparison.")
        return None

    try:
        data = {
            "models": "genai",
            "api_user": api_user,
            "api_secret": api_secret,
        }
        files = {
            "media": (filename, image_bytes, "image/jpeg"),
        }

        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(SIGHTENGINE_URL, data=data, files=files)
            
            if response.status_code != 200:
                logger.warning(f"Sightengine API returned status {response.status_code}: {response.text}")
                return None

            result = response.json()
            if result.get("status") != "success":
                logger.warning(f"Sightengine API failure: {result}")
                return None

            ai_generated_score = result.get("type", {}).get("ai_generated", 0.0)
            
            # Binary classification threshold at 0.50
            if ai_generated_score >= 0.50:
                prediction = "fake"
                confidence = float(ai_generated_score)
            else:
                prediction = "real"
                confidence = float(1.0 - ai_generated_score)

            return {
                "prediction": prediction,
                "confidence": round(confidence, 4),
                "ai_generated_score": round(float(ai_generated_score), 4),
                "status": "success",
            }

    except Exception as e:
        logger.error(f"Error calling Sightengine API: {e}", exc_info=True)
        return None
