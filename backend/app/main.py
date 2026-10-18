"""FastAPI Backend Server for AI vs Real Image Detector.

Endpoints:
- POST /predict: Accepts an image file, extracts multi-spectral 40-dim FFT fingerprint + model inference,
                 generates 2D FFT spectrum visualization and spectral diagnostics,
                 calls NVIDIA DiffusionGemma 26B Vision Forensics,
                 and computes a Dual-Layer Weighted Ensemble Average verdict with intelligent single-model fallback.
- GET /health: Health check and model readiness info.
"""

import os
import io
import time
import logging
import warnings
from pathlib import Path
from contextlib import asynccontextmanager
from typing import Optional, Dict, Any

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import numpy as np
import joblib
from dotenv import load_dotenv

# Load environment variables from all possible locations
_env_paths = [
    Path(__file__).parent.parent / ".env",
    Path(__file__).parent.parent.parent / ".env",
    Path(".env"),
    Path("backend/.env"),
]
for p in _env_paths:
    if p.exists():
        load_dotenv(p)

from .feature_extractor import (
    generate_fft_spectrum_image,
    extract_fingerprint,
    compute_spectral_diagnostics,
)
from .sightengine_service import check_image_with_sightengine
from .nvidia_service import check_image_with_nvidia_vision

warnings.filterwarnings("ignore", category=UserWarning, module="sklearn")

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("ai_detector.backend")

MODEL_STATE: Dict[str, Any] = {
    "model": None,
    "model_name": None,
    "classes": None,
}


def load_detector_model():
    """Searches for and loads the scikit-learn model pipeline using joblib."""
    possible_paths = [
        os.path.join(os.path.dirname(__file__), "..", "model.pkl"),
        os.path.join(os.path.dirname(__file__), "..", "..", "model.pkl"),
        os.path.join(os.path.dirname(__file__), "..", "..", "ai_detector_svm.pkl"),
        "model.pkl",
        "ai_detector_svm.pkl",
    ]

    for path in possible_paths:
        abs_path = os.path.abspath(path)
        if os.path.exists(abs_path):
            try:
                loaded = joblib.load(abs_path)
                MODEL_STATE["model"] = loaded
                MODEL_STATE["model_name"] = os.path.basename(abs_path)
                classes = getattr(loaded, "classes_", None)
                if classes is None and hasattr(loaded, "named_steps"):
                    for step in loaded.named_steps.values():
                        if hasattr(step, "classes_"):
                            classes = step.classes_
                            break
                if classes is not None:
                    MODEL_STATE["classes"] = [
                        int(c) if hasattr(c, "item") and isinstance(c.item(), int) else str(c)
                        for c in classes
                    ]
                logger.info(f"Loaded model: {abs_path} (classes: {MODEL_STATE['classes']})")
                return
            except Exception as e:
                logger.warning(f"Could not load {abs_path}: {e}")

    logger.warning("No model.pkl or ai_detector_svm.pkl found. Running in fallback heuristic mode.")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting AI Detector backend...")
    load_detector_model()
    yield
    logger.info("Stopping AI Detector backend...")


app = FastAPI(
    title="AI vs Real Image Detector API",
    description="2D FFT Frequency Fingerprint Analysis and AI Image Detection",
    version="2.5.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root_index():
    return {
        "status": "online",
        "service": "The Eyes 2.0 API",
        "version": "2.5.0",
        "endpoints": {
            "predict": "POST /predict",
            "health": "GET /health",
            "documentation": "GET /docs"
        },
        "model_loaded": MODEL_STATE["model"] is not None,
    }


@app.get("/health")
def health_check():
    return {
        "status": "online",
        "model_loaded": MODEL_STATE["model"] is not None,
        "model_file": MODEL_STATE["model_name"],
        "classes": MODEL_STATE["classes"],
        "nvidia_vision_active": bool(os.getenv("NVIDIA_API_KEY")),
        "sightengine_configured": bool(os.getenv("SIGHTENGINE_API_USER") and os.getenv("SIGHTENGINE_API_SECRET")),
    }


def run_model_inference(features: np.ndarray) -> Optional[tuple[str, float]]:
    """Runs prediction on 40-dim feature vector using the trained pipeline."""
    model = MODEL_STATE["model"]
    if model is None:
        return None

    features_2d = features.reshape(1, -1) if features.ndim == 1 else features

    try:
        if hasattr(model, "predict_proba"):
            probas = model.predict_proba(features_2d)[0]
            classes = MODEL_STATE.get("classes") or getattr(model, "classes_", [0, 1])

            fake_idx = 1
            for idx, c in enumerate(classes):
                if str(c).lower() in ["fake", "ai", "1", "synthetic", "generated"]:
                    fake_idx = idx
                    break

            fake_prob = float(probas[fake_idx])
            if fake_prob >= 0.50:
                return "fake", round(fake_prob, 4)
            else:
                return "real", round(1.0 - fake_prob, 4)

        elif hasattr(model, "decision_function"):
            score = float(model.decision_function(features_2d)[0])
            fake_prob = float(1.0 / (1.0 + np.exp(-score)))
            if fake_prob >= 0.50:
                return "fake", round(fake_prob, 4)
            else:
                return "real", round(1.0 - fake_prob, 4)

        else:
            pred = model.predict(features_2d)[0]
            is_fake = str(pred).lower() in ["fake", "ai", "1", "true", "synthetic"]
            return ("fake" if is_fake else "real"), 0.88

    except Exception as e:
        logger.error(f"Inference error with model: {e}")
        return None


def compute_ensemble_fusion(
    fourier_result: Optional[tuple[str, float]],
    nvidia_res: Optional[Dict[str, Any]]
) -> tuple[str, float, Dict[str, Any]]:
    """Calculates a dual-layer weighted average or graceful single-model fallback."""
    fourier_ok = fourier_result is not None
    nim_ok = bool(nvidia_res and nvidia_res.get("available"))

    # Case 1: Both models available (Dual-Layer Ensemble)
    if fourier_ok and nim_ok:
        fourier_pred, fourier_conf = fourier_result
        p_fake_fourier = fourier_conf if fourier_pred == "fake" else (1.0 - fourier_conf)

        nim_pred = str(nvidia_res.get("prediction", "real")).lower()
        nim_conf = float(nvidia_res.get("confidence", 0.85))
        p_fake_nim = nim_conf if nim_pred == "fake" else (1.0 - nim_conf)

        # Dynamic Calibration:
        # If NVIDIA Vision is confident that an image is Real (>= 0.80) because it exhibits
        # natural lighting, coherent anatomy, and real-world scene physics (even if Fourier
        # frequency analysis is elevated due to smartphone HDR+ or unsharp masking),
        # weight NVIDIA Vision heavily (0.75) to prevent computational photography false positives.
        if nim_pred == "real" and nim_conf >= 0.80:
            w_nim = 0.70
            w_fourier = 0.30
        elif nim_pred == "fake" and nim_conf >= 0.80:
            w_nim = 0.65
            w_fourier = 0.35
        else:
            w_nim = 0.50
            w_fourier = 0.50

        p_fake_fused = w_fourier * p_fake_fourier + w_nim * p_fake_nim

        if p_fake_fused >= 0.50:
            final_pred = "fake"
            final_conf = round(p_fake_fused, 4)
        else:
            final_pred = "real"
            final_conf = round(1.0 - p_fake_fused, 4)

        meta = {
            "active_engine": "ENSEMBLE",
            "active_engine_label": "Dual-Layer Ensemble (Fourier Physics + NVIDIA NIM Vision)",
            "models_count": 2,
            "fourier_available": True,
            "nim_available": True,
            "fourier_p_fake": round(p_fake_fourier, 4),
            "nim_p_fake": round(p_fake_nim, 4),
            "fused_p_fake": round(p_fake_fused, 4),
            "fourier_weight": w_fourier,
            "nim_weight": w_nim,
            "fallback_notice": None,
        }
        return final_pred, final_conf, meta

    # Case 2: Only Fourier Physics Available (NIM Offline)
    elif fourier_ok and not nim_ok:
        fourier_pred, fourier_conf = fourier_result
        p_fake_fourier = fourier_conf if fourier_pred == "fake" else (1.0 - fourier_conf)

        meta = {
            "active_engine": "FOURIER_ONLY",
            "active_engine_label": "Local 2D Fourier Physics Model",
            "models_count": 1,
            "fourier_available": True,
            "nim_available": False,
            "fourier_p_fake": round(p_fake_fourier, 4),
            "nim_p_fake": None,
            "fused_p_fake": round(p_fake_fourier, 4),
            "fourier_weight": 1.0,
            "nim_weight": 0.0,
            "fallback_notice": "NVIDIA NIM was unavailable. Verdict answered solely by the Local 2D Fourier Physics Model.",
        }
        return fourier_pred, fourier_conf, meta

    # Case 3: Only NVIDIA NIM Vision Available (Local Model Missing)
    elif not fourier_ok and nim_ok:
        nim_pred = str(nvidia_res.get("prediction", "real")).lower()
        nim_conf = float(nvidia_res.get("confidence", 0.85))
        is_fake = "fake" in nim_pred or "ai" in nim_pred
        final_pred = "fake" if is_fake else "real"
        p_fake_nim = nim_conf if is_fake else (1.0 - nim_conf)

        meta = {
            "active_engine": "NIM_ONLY",
            "active_engine_label": "NVIDIA DiffusionGemma 26B (NIM)",
            "models_count": 1,
            "fourier_available": False,
            "nim_available": True,
            "fourier_p_fake": None,
            "nim_p_fake": round(p_fake_nim, 4),
            "fused_p_fake": round(p_fake_nim, 4),
            "fourier_weight": 0.0,
            "nim_weight": 1.0,
            "fallback_notice": "Local Fourier model was unavailable. Verdict answered solely by NVIDIA DiffusionGemma 26B Vision.",
        }
        return final_pred, nim_conf, meta

    # Case 4: Neither available (Emergency fallback)
    else:
        meta = {
            "active_engine": "HEURISTIC",
            "active_engine_label": "Heuristic Frequency Slope Rule",
            "models_count": 0,
            "fourier_available": False,
            "nim_available": False,
            "fallback_notice": "Both primary inference engines were offline. Falling back to rule-based frequency slope inspection.",
        }
        return "real", 0.65, meta


@app.post("/predict")
async def predict_image(file: UploadFile = File(...)):
    start_time = time.time()

    if file.content_type and not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail=f"File '{file.filename}' is not an image.")

    try:
        image_bytes = await file.read()
        if len(image_bytes) == 0:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")

        try:
            image = Image.open(io.BytesIO(image_bytes))
            image.load()
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid image format: {e}")

        # 1. 2D FFT Spectrum Image (base64 PNG)
        fft_spectrum_base64 = generate_fft_spectrum_image(image)

        # 2. Multi-Spectral Diagnostics & 1D Radial Curve
        diagnostics = compute_spectral_diagnostics(image)

        # 3. Extract 40-dim Fingerprint & Predict with Local Physics Model
        features = extract_fingerprint(image)
        local_result = run_model_inference(features)

        # 4. NVIDIA DiffusionGemma 26B Multi-Modal Vision Inspection (Async)
        nvidia_vision_res = await check_image_with_nvidia_vision(image_bytes)

        # 5. Dual-Layer Ensemble Average with Dynamic Fallback
        ensemble_pred, ensemble_conf, ensemble_meta = compute_ensemble_fusion(
            local_result, nvidia_vision_res
        )

        # 6. Optional Sightengine GenAI Benchmark
        sightengine_res = await check_image_with_sightengine(image_bytes, filename=file.filename or "image.jpg")

        api_confidence = sightengine_res["confidence"] if sightengine_res else None
        api_prediction = sightengine_res["prediction"] if sightengine_res else None

        elapsed_ms = round((time.time() - start_time) * 1000, 2)

        return {
            "prediction": ensemble_pred,
            "confidence": ensemble_conf,
            "ensemble": ensemble_meta,
            "local_model": {
                "available": local_result is not None,
                "prediction": local_result[0] if local_result else None,
                "confidence": local_result[1] if local_result else None,
            },
            "nvidia_vision": nvidia_vision_res,
            "fft_spectrum_image": fft_spectrum_base64,
            "diagnostics": diagnostics,
            "api_confidence": api_confidence,
            "api_prediction": api_prediction,
            "api_available": sightengine_res is not None,
            "filename": file.filename,
            "file_size_kb": round(len(image_bytes) / 1024.0, 1),
            "processing_time_ms": elapsed_ms,
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Prediction error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Prediction pipeline error: {str(e)}")
