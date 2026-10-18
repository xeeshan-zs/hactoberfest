import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dropzone from './components/Dropzone';
import SamplePresets from './components/SamplePresets';
import ResultDashboard from './components/ResultDashboard';
import AboutPage from './components/AboutPage';
import WelcomeModal from './components/WelcomeModal';
import { directNimClientAnalysis } from './services/nimClientFallback';
import { AlertCircle, Radio, Sparkles, Shield, Github, Zap } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function App() {
  const [currentView, setCurrentView] = useState('detector'); // 'detector' | 'about'
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [backendHealth, setBackendHealth] = useState(null);

  // Theme Management (Light theme default)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('the_eyes_theme') || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('the_eyes_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const [loadingMessage, setLoadingMessage] = useState('Extracting 2D Fourier Harmonics...');

  const checkHealth = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      if (res.ok) {
        const data = await res.json();
        setBackendHealth(data);
      } else {
        setBackendHealth({ status: 'offline' });
      }
    } catch {
      setBackendHealth({ status: 'offline' });
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleFileSelected = async (selectedFile) => {
    if (!selectedFile) return;

    setFile(selectedFile);
    setError(null);
    setResult(null);

    const previewUrl = URL.createObjectURL(selectedFile);
    setImagePreview(previewUrl);

    setLoading(true);
    setLoadingMessage('Extracting 2D Fourier Harmonics & Neural Features...');

    const msgTimer1 = setTimeout(() => {
      setLoadingMessage('Waking up Cloud Backend (Render free tier boot takes ~25s)...');
    }, 3500);

    const msgTimer2 = setTimeout(() => {
      setLoadingMessage('Evaluating Dual-Layer Ensemble (2D Fourier + NVIDIA DiffusionGemma 26B)...');
    }, 12000);

    // 1. Attempt Backend Inference
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout for sleeping server

      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `HTTP ${response.status}: Server analysis failed.`);
      }

      const data = await response.json();
      setResult(data);
      setCurrentView('detector');
    } catch (backendErr) {
      console.warn('Backend offline / unreachable. Triggering Direct-to-NVIDIA NIM Browser Engine:', backendErr);
      setLoadingMessage('Backend unreachable. Running Browser-Direct NVIDIA NIM Fallback...');

      // 2. Seamless Direct-to-NVIDIA NIM Browser Fallback
      try {
        const directNimData = await directNimClientAnalysis(selectedFile, previewUrl);
        setResult(directNimData);
        setCurrentView('detector');
      } catch (nimErr) {
        console.error('Direct NIM fallback error:', nimErr);
        setError(
          `Cloud backend is offline, and direct browser inference failed: ${nimErr.message}`
        );
      }
    } finally {
      clearTimeout(msgTimer1);
      clearTimeout(msgTimer2);
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setImagePreview(null);
    setResult(null);
    setError(null);
    setCurrentView('detector');
  };

  return (
    <div className="min-h-screen bg-[#F4F4F0] dark:bg-[#050508] text-slate-900 dark:text-white flex flex-col relative selection:bg-[#FFE600] selection:text-black transition-colors duration-200">
      {/* Background Dot Matrix */}
      <div className="fixed inset-0 bg-brutal-grid opacity-35 pointer-events-none" />

      {/* Header */}
      <Header
        backendHealth={backendHealth}
        onReset={handleReset}
        hasResult={!!result}
        theme={theme}
        onToggleTheme={toggleTheme}
        currentView={currentView}
        onNavigate={setCurrentView}
      />

      {/* First-Time Welcome Modal */}
      <WelcomeModal />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-3.5 sm:py-7 z-10">
        {/* Error Alert */}
        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl bg-[#FF2E63] text-white border-2 border-black flex items-start justify-between gap-2.5 sm:gap-3 text-xs font-mono font-black shadow-[4px_4px_0px_#000000]">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 stroke-[3]" />
              <span className="leading-snug">{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="bg-black text-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded border-2 border-white hover:bg-white hover:text-black transition-colors flex-shrink-0 cursor-pointer text-[10px] sm:text-xs"
            >
              DISMISS
            </button>
          </div>
        )}

        {/* View Routing */}
        {currentView === 'about' ? (
          <AboutPage onBackToDetector={() => setCurrentView('detector')} />
        ) : !result ? (
          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 pt-1 sm:pt-2">
            {/* Mission Hero Banner */}
            <div className="glass-brutal rounded-xl p-4 sm:p-8 relative overflow-hidden shadow-[6px_6px_0px_#000000] sm:shadow-[8px_8px_0px_#000000]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
                <div>
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                    <span className="px-2.5 sm:px-3 py-1 rounded bg-[#FFE600] text-black font-mono font-black text-[11px] sm:text-xs border-2 border-black shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_#FFFFFF]">
                      AI FORENSICS
                    </span>
                    <span className="px-2.5 sm:px-3 py-1 rounded bg-white dark:bg-[#181824] text-black dark:text-white font-mono font-black text-[11px] sm:text-xs border-2 border-black dark:border-white shadow-[2px_2px_0px_#000000]">
                      2D-FFT SPEC
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-mono tracking-tight text-black dark:text-white leading-tight">
                    Frequency Domain <span className="underline underline-offset-4 decoration-4 text-black dark:text-[#FFE600]">AI Detector</span>
                  </h1>

                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-100 font-mono mt-2 sm:mt-3 max-w-xl leading-relaxed font-bold">
                    Computes 2D Fourier log-magnitude harmonic decay to isolate generative latent diffusion VAE upsampling artifacts across Midjourney, ChatGPT (DALL-E 3), Gemini (Imagen 3), and SDXL.
                  </p>
                </div>

                <div className="hidden md:flex flex-col items-end text-right font-mono text-xs text-black dark:text-white border-l-2 border-black/30 dark:border-white/40 pl-6 space-y-2">
                  <span className="px-3 py-1.5 rounded bg-white dark:bg-[#181824] border-2 border-black dark:border-white font-black shadow-brutal-sm text-black dark:text-white">
                    Multi-Spectral Pipeline
                  </span>
                  <span className="px-3 py-1.5 rounded bg-white dark:bg-[#181824] border-2 border-black dark:border-white text-black dark:text-white font-bold shadow-brutal-sm">
                    40-Dim FFT Harmonics
                  </span>
                  <span className="px-3 py-1.5 rounded bg-[#00F5A0] text-black font-black border-2 border-black shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_#FFFFFF]">
                    Serverless Direct NIM Fallback
                  </span>
                </div>
              </div>
            </div>

            {/* Dropzone */}
            <Dropzone
              onFileSelected={handleFileSelected}
              loading={loading}
              loadingMessage={loadingMessage}
              currentPreview={imagePreview}
            />

            {/* Benchmark Presets */}
            <SamplePresets
              onSelectSample={handleFileSelected}
              disabled={loading}
            />

            {/* Explainer 3-Column Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-brutal-card rounded-xl p-5 sm:p-6 border-2 border-black dark:border-[#00F0FF] bg-[#F0F9FF] dark:bg-[#0A141A] flex flex-col justify-between min-h-[140px]">
                <div className="text-xs font-mono font-black text-[#0369A1] dark:text-[#00F0FF] uppercase mb-2.5 flex items-center gap-2">
                  <Radio className="w-4 h-4 stroke-[3]" />
                  01. 2D Fourier Matrix
                </div>
                <p className="text-xs text-slate-800 dark:text-white font-mono leading-relaxed font-bold">
                  Translates spatial RGB pixels into continuous 2D frequency harmonics.
                </p>
              </div>

              <div className="glass-brutal-card rounded-xl p-5 sm:p-6 border-2 border-black dark:border-[#00F5A0] bg-[#ECFDF5] dark:bg-[#0A1A14] flex flex-col justify-between min-h-[140px]">
                <div className="text-xs font-mono font-black text-[#047857] dark:text-[#00F5A0] uppercase mb-2.5 flex items-center gap-2">
                  <Shield className="w-4 h-4 stroke-[3]" />
                  02. Azimuthal Decay
                </div>
                <p className="text-xs text-slate-800 dark:text-white font-mono leading-relaxed font-bold">
                  Isolates abnormal high-frequency shelves characteristic of neural latent decoders.
                </p>
              </div>

              <div className="glass-brutal-card rounded-xl p-5 sm:p-6 border-2 border-black dark:border-[#B066FF] bg-[#FAF5FF] dark:bg-[#140A1A] flex flex-col justify-between min-h-[140px]">
                <div className="text-xs font-mono font-black text-[#6D28D9] dark:text-[#B066FF] uppercase mb-2.5 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 stroke-[3]" />
                  03. Cloud Consensus
                </div>
                <p className="text-xs text-slate-800 dark:text-white font-mono leading-relaxed font-bold">
                  Side-by-side consensus validation with NVIDIA DiffusionGemma 26B Vision AI.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <ResultDashboard
            result={result}
            originalImagePreview={imagePreview}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-black dark:border-white bg-white dark:bg-black py-4 text-center text-xs text-black dark:text-white font-mono font-black z-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="font-black tracking-wide">THE EYES 2.0 • BUILT BY ZEESHAN SARFRAZ</span>
            <button
              onClick={() => setCurrentView('about')}
              className="text-[#0284C7] dark:text-[#00F0FF] underline underline-offset-4 decoration-2 hover:text-black dark:hover:text-white transition-colors cursor-pointer font-black"
            >
              [ABOUT PROJECT]
            </button>
          </div>
          <a
            href="https://github.com/xeeshan-zs/The-Eyes"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 rounded bg-[#FFE600] text-black border-2 border-black font-mono font-black flex items-center gap-1.5 shadow-[2px_2px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all cursor-pointer"
          >
            <Github className="w-3.5 h-3.5" />
            <span>github.com/xeeshan-zs/The-Eyes ↗</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
