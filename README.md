<div align="center">

# THE EYES

### Look beneath the surface.

Image forensics through Fourier analysis, spectral patterns, and model comparison.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-EDB56D)](LICENSE)

[Get started](#getting-started) · [Features](#features) · [Current status](#current-status) · [Configuration](#configuration)

</div>

---

The Eyes examines signals associated with AI-generated imagery. It combines frequency-domain analysis with available vision-model responses and presents the evidence in an interactive forensic workspace.

## Features

- **Frequency analysis:** inspect a 2D Fourier log-magnitude spectrum and radial power profile.
- **Spectral diagnostics:** explore high-frequency energy, entropy, image dimensions, and processing time.
- **Model comparison:** review local classification alongside NVIDIA vision analysis and optional Sightengine results when configured.
- **Interactive inspection:** compare the original image with its spectrum and explore the result dashboard.
- **Image input:** choose, drop, or paste an image into the analyzer.
- **Benchmark presets:** run existing generated test patterns through the analysis flow.
- **Browser fallback:** if the backend is unreachable, the frontend can attempt a direct-to-NVIDIA analysis path when configured.

Classification is an estimate, not proof of an image’s origin. Interpret it alongside the diagnostics and other evidence. No accuracy or latency benchmark is asserted here.

## Current status

- **Guest quota:** no authoritative quota API or shared contract exists in this repository. The app does not enforce a five-check limit or invent a remaining-check count.
- **Authentication:** `frontend/src/firebase.js` initializes the shared Firebase app and exports its Auth instance for future account flows. Sign-up and sign-in routes are not implemented, and enabled providers are not documented.
- **Analysis:** uploads use the existing backend request and browser fallback. Successful analysis requires the applicable services and configuration to be available.

## Getting started

### Prerequisites

- Node.js 18 or later, with npm
- Python 3.10 or later for the local API
- Firebase web app configuration for the frontend
- Optional NVIDIA and Sightengine credentials for cloud integrations

### Frontend

From the repository root:

```powershell
cd frontend
npm.cmd ci
Copy-Item .env.example .env.local
```

Fill in your Firebase web settings in `frontend/.env.local`. To use the local API, set:

```dotenv
VITE_API_URL=http://localhost:8000
```

The example environment file points to a hosted API. Change it explicitly if you intend to run analysis locally.

Start the development server:

```powershell
npm.cmd run dev
```

Open **[localhost:5173](http://localhost:5173)**.

On macOS or Linux, use `npm` instead of `npm.cmd` and `cp` instead of `Copy-Item`. Restart Vite after changing environment variables.

The analyzer UI can be reviewed without starting Python. Image analysis needs a working API or the existing configured browser fallback.

### Local API

In a separate terminal, from the repository root:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
Copy-Item .env.example .env
```

Add any cloud-service credentials you intend to use, then start the server:

```powershell
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
```

On macOS or Linux, use `.venv/bin/python` instead of `.\.venv\Scripts\python.exe`.

- API health: [localhost:8000/health](http://localhost:8000/health)
- Interactive API documentation: [localhost:8000/docs](http://localhost:8000/docs)

The backend searches for serialized model files (`model.pkl` or `ai_detector_svm.pkl`) at startup. Check `/health` to confirm whether a model loaded and which optional integrations are configured.

## Configuration

Keep local environment files out of Git. Both example files contain placeholders only.

### Frontend — `frontend/.env.local`

```dotenv
VITE_API_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=your_firebase_web_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_web_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

`frontend/src/firebase.js` initializes the shared Firebase app and exports its Auth instance. Reuse that instance for future account flows. Do not initialize another app or assume a provider is enabled.

Vite embeds `VITE_` variables in browser code. Use them for the intended public web configuration, never for service-account credentials or private service keys. Configure NVIDIA credentials on the backend for server-side requests.

### Backend — `backend/.env`

```dotenv
NVIDIA_API_KEY=your_nvidia_api_key
SIGHTENGINE_API_USER=your_sightengine_user_id
SIGHTENGINE_API_SECRET=your_sightengine_api_secret
```

Cloud results depend on credentials, provider availability, and network access. Images can be sent to configured external providers during analysis; this project does not promise local-only processing.

## Analysis workflow

1. **Select an image.** Upload, drag and drop, paste, or choose an existing benchmark pattern.
2. **Request analysis.** The frontend sends the file to the backend’s `/predict` endpoint.
3. **Extract evidence.** The backend computes the Fourier spectrum, spectral diagnostics, and available local-model prediction.
4. **Compare available models.** Configured NVIDIA and Sightengine integrations contribute additional responses.
5. **Review the result.** The result dashboard displays the returned classification and supporting diagnostics.

The frontend also contains an existing direct-to-NVIDIA browser fallback for backend failures. Its availability depends on its configuration and browser/network restrictions. It does not implement guest-quota enforcement.

## Project structure

```text
.
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Dropzone.jsx
│   │   │   ├── SamplePresets.jsx
│   │   │   ├── ResultDashboard.jsx
│   │   │   ├── VerdictBadge.jsx
│   │   │   ├── ForensicMetrics.jsx
│   │   │   ├── RadialProfileChart.jsx
│   │   │   ├── ImageComparisonSlider.jsx
│   │   │   ├── ApiComparison.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   └── WelcomeModal.jsx
│   │   ├── services/
│   │   │   └── nimClientFallback.js   # Browser analysis fallback
│   │   ├── App.jsx                    # View state and analysis orchestration
│   │   ├── firebase.js                # Shared Firebase app and Auth instance
│   │   ├── main.jsx
│   │   └── index.css
│   └── .env.example
├── backend/
│   ├── app/
│   │   ├── main.py                    # API endpoints and analysis orchestration
│   │   ├── feature_extractor.py
│   │   ├── nvidia_service.py
│   │   └── sightengine_service.py
│   ├── evaluate_detector.py
│   ├── evaluation.json
│   ├── tests/
│   ├── requirements.txt
│   └── .env.example
├── firebase.json
├── train_model.py
└── LICENSE
```

## Ensemble weighting and local evaluation

When both engines return results, `/predict` uses **80% NVIDIA DiffusionGemma / 20% local trained classifier** for both real and fake classifications, including when Gemma reports lower confidence. Each engine's label confidence is converted to a fake-class score first:

```text
P(fake) = 0.80 * Gemma_P(fake) + 0.20 * local_P(fake)
```

The final label is fake at scores >= 0.5, otherwise real; the displayed confidence is the score for that final label. The API reports the weights in `ensemble.nim_weight` and `ensemble.fourier_weight`, and the comparison cards read those fields. A single available engine still gets 100% weight. The existing neither-engine fallback is unchanged. These weights express a product preference, not measured model accuracies or calibrated probabilities. Gemma's self-reported confidence is not a measured accuracy.

The saved backend estimator was created with scikit-learn 1.9.0; requirements now pin that version. The serving artifact uses 40 features, while the repository's current training script describes a 70-feature pipeline. Evaluation therefore uses `app.feature_extractor.extract_fingerprint` and the existing artifact directly, without running the training script or overwriting weights.

Reproduce the evaluation from `backend` using a labeled archive containing `test/real` and `test/fake`:

```powershell
..\.venv\Scripts\python.exe evaluate_detector.py "PATH\TO\archive.zip" --output evaluation.json
..\.venv\Scripts\python.exe -m unittest discover -s tests -v
```

The sampled result was **56.25% (225/400 correct)**: 89/200 real images and 136/200 fake images classified correctly, with no unreadable samples. The checked-in `backend/evaluation.json` records the actual sample, artifact SHA-256, runtime version, confusion matrix and score. It evaluates only the local saved classifier, not a deployed Render instance or Gemma. Training overlap and dataset provenance are unverified, so this is not an independently established held-out or universal accuracy. No new API requests or retraining are needed for this evaluation. The 80/20 ensemble still needs its own labeled evaluation before claiming better accuracy.

## Build and verification

```powershell
cd frontend
npm.cmd run build
npm.cmd run preview
```

The production build is written to `frontend/dist`. Use the URL printed by the preview command to inspect it.

The repository has no configured automated lint or type-check scripts. Backend unit tests can be run with `unittest` as shown above.

## Contributing

Preserve the existing analyzer, result dashboard, shared shell, and authentication setup unless a task explicitly includes them.

For quota or account work, establish the authoritative service contract and configured Firebase providers first. Do not add a competing client-only quota, fabricate analysis responses, or commit environment files.

## Author and license

Created by **Full Sack Four Eyes**. Licensed under the [MIT License](LICENSE).

## Install The Eyes as an app (PWA)

The frontend now includes a web app manifest, standalone app icons, and a service worker. On the first browser visit, an installation popup appears. Supported browsers offer a native **Install app** button when their installation event is available. Safari on iPhone/iPad gets Share → Add to Home Screen instructions. Dismissing the popup is remembered; the floating **Install app** button can reopen it. The old first-visit API-key popup is replaced by this installation prompt; the header's key controls remain available.

Native installation requires a user action and depends on the browser. It cannot be forced automatically. Installed standalone windows suppress the installation prompt. For deployment, serve the production build over HTTPS; localhost is supported for testing. Ordinary HTTP on a LAN IP is not sufficient.

Test the real PWA build in two steps:

```powershell
cd frontend
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

Open http://127.0.0.1:4173 in a normal Chrome or Edge window. The development server at port 5173 shows the popup UI, but the service worker is deliberately enabled only in production builds. The Firebase Hosting configuration gives hashed assets long-lived caching and makes the service worker, manifest, and index revalidate. No hosting deployment was performed.

After a successful online load, the interface can reopen offline. **Image analysis still requires connectivity.** Only application files and icons are precached; uploads, API responses, and credentials are not added to the service-worker cache. Optional Firebase Analytics initialization is skipped offline. New app versions offer an Update action, warning that a reload clears the currently selected image.

To repeat the first-visit prompt during development, remove only `the_eyes_install_prompt_seen_v1` from this site's local storage. Installation/dismissal state is specific to the browser and origin.

Verification: production build passed; a fresh isolated Edge profile reported no manifest/installability errors. Service-worker activation, offline reload, cache contents, first-visit popup, remembered dismissal, reopening, and standalone suppression passed browser checks without page errors. The native install callback was simulated; no OS app was installed by automation. iPhone instructions were checked through browser emulation, not on a physical iPhone. Actual browser/OS installation remains a manual check.
