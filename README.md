<div align="center">

# 👁️ THE EYES
### Forensic 2D FFT Frequency Fingerprint Classifier for AI-Generated Images

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Scikit-Learn](https://img.shields.io/badge/scikit--learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<p align="center">
  <b>A forensic-grade, dark-mode full-stack web application designed for detecting synthetic AI imagery (GANs, Diffusion models, Midjourney, DALL-E, SDXL) via 2D Fast Fourier Transform (FFT) frequency fingerprinting and azimuthal radial power spectrum decay analysis.</b>
</p>

</div>

---

## 🔬 Scientific Core: How It Works

Generative neural networks (GANs and Latent Diffusion Models) synthesize images through transposed convolutions and spatial upsampling. These architectures inevitably leave **periodic high-frequency harmonic grid artifacts** across the frequency domain that are imperceptible in the spatial RGB pixel matrix, but strikingly evident under **2D Fourier spectral analysis**.

```
                        ┌──────────────────────────────┐
                        │   Spatial RGB Input Image    │
                        └──────────────┬───────────────┘
                                       │
                                       ▼
                 ┌───────────────────────────────────────────┐
                 │    2D Fast Fourier Transform (FFT-2D)     │
                 │      F(u,v) = ∬ f(x,y) e^{-j2π(ux+vy)}    │
                 └─────────────────────┬─────────────────────┘
                                       │
                                       ▼
                 ┌───────────────────────────────────────────┐
                 │     Centered Log-Magnitude Spectrum       │
                 │         S(u,v) = log(1 + |F(u,v)|)        │
                 └─────────────────────┬─────────────────────┘
                                       │
                    ┌──────────────────┴──────────────────┐
                    ▼                                     ▼
     ┌─────────────────────────────┐       ┌─────────────────────────────┐
     │  1D Azimuthal Radial Decay  │       │   Inferno Visual Spectrum   │
     │      Profile Extraction     │       │    PNG Data URI Generator   │
     └──────────────┬──────────────┘       └─────────────────────────────┘
                    │
                    ▼
     ┌─────────────────────────────┐
     │  Scikit-Learn Classifier    │
     │  (SVM / Random Forest Model)│
     └──────────────┬──────────────┘
                    │
                    ▼
     ┌─────────────────────────────┐
     │   Forensic Classification   │
     │   AUTHENTIC  vs.  SYNTHETIC │
     └─────────────────────────────┘
```

1. **2D Continuous Fourier Transform**: The grayscale spatial representation $f(x, y)$ is transformed into the frequency plane $F(u, v)$ with the zero-frequency DC component shifted to the center.
2. **Log-Magnitude Spectrum**: Computes $S(u, v) = \log(1 + |F(u, v)|)$ and maps it to a normalized dynamic range with an `inferno` colormap.
3. **1D Azimuthal Radial Integration**: Averages circular frequency bands from radius $r=0$ (DC component) to $r=r_{\max}$ (Nyquist frequency $\pi$), generating a 1D spectral energy profile.
4. **Natural $1/f^\alpha$ Power-Law vs. Synthetic Anomalies**:
   - **Authentic Photos**: Obey natural optical statistics with smooth, asymptotic exponential decay ($1/f^2$).
   - **AI-Generated Images**: Exhibit distinct high-frequency energy shelves, periodic spectral spikes, and elevated residual ratios near the Nyquist limit.

---

## ✨ Features

- 🖥️ **Forensic Precision Terminal UI**: Built following the **UI-UX Pro Max** design system with a high-contrast dark theme, crisp grid borders, and surgical typography (`Inter` + `JetBrains Mono`).
- ⚡ **Zero-Cloud Privacy & Low Latency**: Core inference runs locally in under `50ms` using scikit-learn without uploading your images to third-party servers.
- 🎚️ **Interactive Spatial ↔ Spectral Split Wiper**: Drag-to-wipe comparison slider inspecting original pixels directly against the 2D FFT spectrum with live $(u, v)$ frequency coordinate tracking.
- 📈 **1D Azimuthal Radial Power Spectrum Chart**: Real-time interactive SVG curve plotting empirical frequency decay against the theoretical natural $1/f^\alpha$ optical baseline with Nyquist anomaly zone highlights.
- 🧪 **1-Click Preset Benchmark Suite**: Includes pre-calibrated test cases (*DSLR Camera Portrait*, *Natural Landscape*, *Midjourney v6 Portrait*, *SDXL Diffusion Render*) for instant live demo presentation.
- 🌐 **Commercial Cloud API Benchmarking**: Optional integration with **Sightengine GenAI API** (`https://api.sightengine.com/1.0/check.json`) for live side-by-side consensus validation.
- 📊 **Numerical Forensic Telemetry**: Real-time readouts for **High-Frequency Residual Energy Ratio**, **Spectral Entropy ($H$)**, **Image Resolution Matrix**, and **Processing Latency**.
- 📋 **Forensic Export Tools**: Export high-res 2D FFT spectra as PNG or copy complete forensic JSON telemetry payloads with one click.

---

## 📁 Repository Structure

```
the eyes/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                 # FastAPI backend, CORS, /predict endpoint
│   │   ├── feature_extractor.py    # extract_fingerprint, FFT spectrum & diagnostics
│   │   └── sightengine_service.py  # Sightengine GenAI API client
│   ├── .env.example                # Sample environment variables
│   ├── requirements.txt            # Python dependencies
│   └── model.pkl                   # (Optional location for trained model)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx                # System status bar with live telemetry
│   │   │   ├── Dropzone.jsx              # Drag-and-drop / paste image zone
│   │   │   ├── SamplePresets.jsx         # 1-click test benchmark suite
│   │   │   ├── VerdictBadge.jsx          # Hero REAL vs AI-GENERATED verdict
│   │   │   ├── ForensicMetrics.jsx       # Diagnostic numerical readouts
│   │   │   ├── RadialProfileChart.jsx    # 1D Azimuthal radial decay chart
│   │   │   ├── ImageComparisonSlider.jsx # Interactive split wiper slider
│   │   │   ├── ApiComparison.jsx         # Model vs Sightengine comparison card
│   │   │   └── ResultDashboard.jsx       # Unified multi-mode workspace
│   │   ├── App.jsx                       # Application state & routing
│   │   ├── main.jsx                      # React entrypoint
│   │   └── index.css                     # Tailwind CSS & animations
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── ai_detector_svm.pkl             # Pre-trained SVM model weights
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm**

---

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create and activate a virtual environment
python -m venv venv

# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# On macOS / Linux:
# source venv/bin/activate

# Install Python requirements
pip install -r requirements.txt

# (Optional) Setup Sightengine API credentials
cp .env.example .env

# Start the FastAPI development server
uvicorn app.main:app --reload --port 8000
```

- Backend API: `http://localhost:8000`
- API Health Status: `http://localhost:8000/health`
- Interactive OpenAPI Docs: `http://localhost:8000/docs`

---

### 2. Frontend Setup

In a separate terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

Open your browser at **`http://localhost:5173`**.

---

## 🔧 Integrating Your Own Custom Model

You can easily replace the model and feature extractor with your own:

1. **Place your trained model**: Save your scikit-learn model as `model.pkl` in `backend/` (or keep `ai_detector_svm.pkl` in the root).
2. **Update feature extraction**: Open `backend/app/feature_extractor.py` and modify `extract_fingerprint(image)` to match your custom feature representation:

```python
def extract_fingerprint(image: Image.Image) -> np.ndarray:
    """
    PASTE YOUR CUSTOM FEATURE EXTRACTION CODE HERE.
    
    Accepts: PIL Image object
    Returns: 1D numpy array of features matching your model's input shape.
    """
    # ... your custom feature vector calculation ...
    return feature_vector
```

---

## 🌐 Sightengine GenAI API Setup (Optional)

To enable side-by-side commercial comparison on the dashboard:
1. Create a free account at [Sightengine](https://sightengine.com/).
2. In `backend/.env`, set:
   ```env
   SIGHTENGINE_API_USER=your_user_id
   SIGHTENGINE_API_SECRET=your_secret_key
   ```
3. Restart the backend server. The dashboard will automatically display live side-by-side consensus validation!

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
