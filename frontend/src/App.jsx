import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dropzone from './components/Dropzone';
import SamplePresets from './components/SamplePresets';
import ResultDashboard from './components/ResultDashboard';
import AboutPage from './components/AboutPage';
import InstallPrompt from './components/InstallPrompt';
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
      <div className="fixed inset-0 bg-brutal-grid opacity-20 pointer-events-none" />

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

      {/* First-visit app installation prompt */}
      <InstallPrompt />

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
          <div className="max-w-4xl mx-auto space-y-5 sm:space-y-7 pt-2 sm:pt-4">
            <section className="inspection-hero glass-brutal rounded-2xl p-6 sm:p-10 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-5">
                <span className="w-2 h-2 rounded-full bg-[#059669] dark:bg-[#00F5A0]" />
                <span className="text-[11px] font-mono font-bold tracking-[0.16em] uppercase text-slate-600 dark:text-slate-300">A closer look at your images</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div className="max-w-xl">
                  <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-black dark:text-white leading-[1.12]">
                    See beyond<br /><span className="hero-highlight">the pixels.</span>
                  </h1>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-5 leading-relaxed max-w-md">
                    Explore image patterns and AI visual analysis in one workspace. Upload an image to compare the signals behind the score.
                  </p>
                </div>
                <div className="flex sm:flex-col gap-2 shrink-0 flex-wrap">
                  <span className="hero-engine"><Radio className="w-4 h-4" /> FFT analysis</span>
                  <span className="hero-engine"><Sparkles className="w-4 h-4" /> Gemma vision</span>
                </div>
              </div>
              <div className="hero-workflow mt-8 pt-5 grid grid-cols-3 gap-3 text-[10px] sm:text-xs font-mono font-bold">
                <span><b>01</b> Upload</span><span><b>02</b> Analyze</span><span><b>03</b> Compare</span>
              </div>
            </section>

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
                  01. Frequency patterns
                </div>
                <p className="text-xs text-slate-800 dark:text-white font-mono leading-relaxed font-bold">
                  Inspect the patterns beneath the image with a 2D frequency spectrum.
                </p>
              </div>

              <div className="glass-brutal-card rounded-xl p-5 sm:p-6 border-2 border-black dark:border-[#00F5A0] bg-[#ECFDF5] dark:bg-[#0A1A14] flex flex-col justify-between min-h-[140px]">
                <div className="text-xs font-mono font-black text-[#047857] dark:text-[#00F5A0] uppercase mb-2.5 flex items-center gap-2">
                  <Shield className="w-4 h-4 stroke-[3]" />
                  02. Spectral detail
                </div>
                <p className="text-xs text-slate-800 dark:text-white font-mono leading-relaxed font-bold">
                  Explore frequency decay and texture measurements alongside the original image.
                </p>
              </div>

              <div className="glass-brutal-card rounded-xl p-5 sm:p-6 border-2 border-black dark:border-[#B066FF] bg-[#FAF5FF] dark:bg-[#140A1A] flex flex-col justify-between min-h-[140px]">
                <div className="text-xs font-mono font-black text-[#6D28D9] dark:text-[#B066FF] uppercase mb-2.5 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 stroke-[3]" />
                  03. Visual reasoning
                </div>
                <p className="text-xs text-slate-800 dark:text-white font-mono leading-relaxed font-bold">
                  Compare your local model with Gemma’s assessment of visible details.
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
          <div className="flex flex-col items-center sm:items-start gap-2 text-center sm:text-left">
            <span className="font-black tracking-wide">THE EYES · BUILT BY FULL STACK FOUR EYES</span>
            <span className="text-[10px] sm:text-xs font-normal text-slate-500 dark:text-slate-400">Zeeshan Sarfraz · Laiba Badar · Javeria Javaid</span>
            <button
              onClick={() => setCurrentView('about')}
              className="text-[#0284C7] dark:text-[#00F0FF] underline underline-offset-4 decoration-2 hover:text-black dark:hover:text-white transition-colors cursor-pointer font-black"
            >
              [ABOUT PROJECT]
            </button>
          </div>
          <a
            href="https://github.com/xeeshan-zs/hactoberfest"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 rounded bg-[#FFE600] text-black border-2 border-black font-mono font-black flex items-center gap-1.5 shadow-[2px_2px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all cursor-pointer"
          >
            <Github className="w-3.5 h-3.5" />
            <span>github.com/xeeshan-zs/hactoberfest ↗</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
