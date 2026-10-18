import React from 'react';
import { 
  Cpu, 
  Database, 
  Layers, 
  Sparkles, 
  Github, 
  Globe, 
  ArrowLeft, 
  Activity, 
  Radio, 
  ShieldCheck, 
  Zap, 
  Terminal,
  ExternalLink,
  Code2
} from 'lucide-react';

export default function AboutPage({ onBackToDetector }) {
  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 py-2 sm:py-4">
      {/* Top Breadcrumb / Return Button */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onBackToDetector}
          className="btn-brutal-yellow px-3 sm:px-4 py-2 rounded-lg text-xs font-mono font-black flex items-center gap-1.5 sm:gap-2 cursor-pointer shadow-[2px_2px_0px_#000000] sm:shadow-[3px_3px_0px_#000000] dark:shadow-[2px_2px_0px_#FFFFFF]"
        >
          <ArrowLeft className="w-3.5 sm:w-4 h-3.5 sm:h-4 stroke-[3]" />
          <span>BACK TO DETECTOR</span>
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono font-black">
          <span className="hidden xs:inline-block px-2 sm:px-3 py-1 rounded bg-black text-white dark:bg-white dark:text-black border-2 border-black">
            SPEC 2.5.0
          </span>
          <span className="px-2.5 sm:px-3 py-1 rounded bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0px_#000000]">
            PROJECT DOSSIER
          </span>
        </div>
      </div>

      {/* Hero Dossier Card */}
      <div className="glass-brutal rounded-xl p-5 sm:p-10 relative overflow-hidden shadow-[6px_6px_0px_#000000] sm:shadow-[8px_8px_0px_#000000]">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
            <span className="px-2.5 sm:px-3 py-1 rounded bg-[#00F5A0] text-black font-mono font-black text-[11px] sm:text-xs border-2 border-black shadow-[2px_2px_0px_#000000]">
              THE EYES ARCHITECTURE
            </span>
            <span className="px-2.5 sm:px-3 py-1 rounded bg-white dark:bg-[#181824] text-black dark:text-white font-mono font-black text-[11px] sm:text-xs border-2 border-black dark:border-white shadow-[2px_2px_0px_#000000]">
              SPECTRAL FORENSICS
            </span>
          </div>

          <h1 className="text-2xl sm:text-5xl font-black font-mono tracking-tight text-black dark:text-white leading-tight">
            How <span className="underline underline-offset-4 decoration-4 text-black dark:text-[#FFE600]">The Eyes</span> Was Built
          </h1>

          <p className="text-xs sm:text-base text-slate-800 dark:text-slate-100 font-mono mt-3 sm:mt-4 leading-relaxed font-bold">
            A dual-layer forensic system combining sub-pixel 2D Fourier mathematical physics with multi-modal neural vision to detect generative AI artifacts across Midjourney, ChatGPT (DALL-E 3), Gemini (Imagen 3), and SDXL.
          </p>
        </div>
      </div>

      {/* Creator Profile Section */}
      <div className="glass-brutal-card rounded-xl p-5 sm:p-8 border-2 border-black dark:border-white shadow-[5px_5px_0px_#000000] sm:shadow-[6px_6px_0px_#000000] bg-white dark:bg-[#14141E]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6 pb-5 sm:pb-6 border-b-2 border-black/10 dark:border-white/20">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-xl bg-[#FFE600] border-2 border-black shadow-[3px_3px_0px_#000000] sm:shadow-[4px_4px_0px_#000000] dark:shadow-[3px_3px_0px_#FFFFFF] flex items-center justify-center font-mono font-black text-xl sm:text-2xl text-black flex-shrink-0">
              ⚡
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-3xl font-black font-mono text-black dark:text-white">
                  Zeeshan Sarfraz
                </h2>
                <span className="text-[10px] sm:text-[11px] font-mono font-black px-2 py-0.5 rounded bg-[#00F0FF] text-black border border-black shadow-[1px_1px_0px_#000000]">
                  CREATOR &amp; ML RESEARCHER
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-mono mt-1 font-bold leading-relaxed">
                Builder specializing in Computer Vision, Multi-Spectral Digital Forensics, and Machine Learning Systems.
              </p>
            </div>
          </div>

          {/* High-Affordance Interactive Links */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 font-mono text-xs font-black w-full sm:w-auto">
            <a
              href="https://github.com/xeeshan-zs"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-brutal-yellow px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 border-2 border-black shadow-[3px_3px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all cursor-pointer"
            >
              <Github className="w-4 h-4 stroke-[2.5]" />
              <span>GITHUB PROFILE</span>
              <ExternalLink className="w-3.5 h-3.5 stroke-[3]" />
            </a>

            <a
              href="https://github.com/xeeshan-zs/The-Eyes"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-lg bg-[#00F0FF] text-black border-2 border-black font-black flex items-center justify-center gap-2 shadow-[3px_3px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all cursor-pointer"
            >
              <Code2 className="w-4 h-4 stroke-[2.5]" />
              <span>OPEN REPOSITORY</span>
              <ExternalLink className="w-3.5 h-3.5 stroke-[3]" />
            </a>
          </div>
        </div>

        {/* Hardware & Training Pipeline Stats - Spacious Padding */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="p-5 sm:p-6 rounded-lg bg-[#F8F9FA] dark:bg-black border-2 border-black dark:border-white shadow-[3px_3px_0px_#000000] flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center gap-2 text-xs font-mono font-black text-[#B45309] dark:text-[#FFE600] mb-2">
              <Database className="w-4 h-4 stroke-[3]" />
              50 GB TRAINING DATASET
            </div>
            <p className="text-xs text-slate-800 dark:text-slate-200 font-mono font-bold leading-relaxed">
              Curated across 140,000+ authentic DSLR exposures and generative diffusion samples.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-lg bg-[#F8F9FA] dark:bg-black border-2 border-black dark:border-white shadow-[3px_3px_0px_#000000] flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center gap-2 text-xs font-mono font-black text-[#047857] dark:text-[#00F5A0] mb-2">
              <Cpu className="w-4 h-4 stroke-[3]" />
              RTX 3090 GPU PIPELINE
            </div>
            <p className="text-xs text-slate-800 dark:text-slate-200 font-mono font-bold leading-relaxed">
              Accelerated high-throughput 2D Fast Fourier Transform feature extraction and cross-validation.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-lg bg-[#F8F9FA] dark:bg-black border-2 border-black dark:border-white shadow-[3px_3px_0px_#000000] flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center gap-2 text-xs font-mono font-black text-[#0369A1] dark:text-[#00F0FF] mb-2">
              <Sparkles className="w-4 h-4 stroke-[3]" />
              DIFFUSIONGEMMA 26B
            </div>
            <p className="text-xs text-slate-800 dark:text-slate-200 font-mono font-bold leading-relaxed">
              Dual-layer consensus fusion with NVIDIA NIM multi-modal vision reasoning.
            </p>
          </div>
        </div>
      </div>

      {/* Engineering Deep-Dive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step 1: Fourier Physics */}
        <div className="glass-brutal-card rounded-xl p-6 sm:p-7 border-2 border-black dark:border-white shadow-[6px_6px_0px_#000000] bg-white dark:bg-[#14141E] flex flex-col justify-between min-h-[280px]">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-black/10 dark:border-white/20">
              <span className="text-xs font-mono font-black px-3 py-1 rounded bg-[#00F0FF] text-black border border-black shadow-[2px_2px_0px_#000000]">
                LAYER 01 // FOURIER PHYSICS
              </span>
              <Radio className="w-5 h-5 text-black dark:text-white stroke-[2.5]" />
            </div>

            <h3 className="text-xl font-black font-mono text-black dark:text-white mb-2">
              Sub-Pixel Frequency Harmonics
            </h3>

            <p className="text-xs text-slate-800 dark:text-slate-200 font-mono leading-relaxed font-bold space-y-2">
              Natural real-world optical camera sensors obey physical Poisson-Gaussian photon noise statistics, yielding a continuous power decay slope:
            </p>
            
            <div className="my-3 p-3 rounded-lg bg-black text-[#00F0FF] font-mono font-black text-xs border border-black">
              E(r) ∝ r^(-α), where α ≈ 1.8 – 2.2
            </div>

            <p className="text-xs text-slate-800 dark:text-slate-200 font-mono leading-relaxed font-bold">
              Generative neural networks (such as Midjourney, DALL-E 3, and Imagen) utilize deconvolutional latent upsamplers that introduce abnormal high-frequency noise shelves and periodic cross-spikes in the 2D spectrum.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-black/10 dark:border-white/10 text-[11px] font-mono font-bold text-slate-600 dark:text-slate-400">
            40-Dimensional Feature Fingerprint • Scikit-Learn Fast Classifier
          </div>
        </div>

        {/* Step 2: NVIDIA Vision LLM */}
        <div className="glass-brutal-card rounded-xl p-6 sm:p-7 border-2 border-black dark:border-white shadow-[6px_6px_0px_#000000] bg-white dark:bg-[#14141E] flex flex-col justify-between min-h-[280px]">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-black/10 dark:border-white/20">
              <span className="text-xs font-mono font-black px-3 py-1 rounded bg-[#FFE600] text-black border border-black shadow-[2px_2px_0px_#000000]">
                LAYER 02 // NEURAL VISION
              </span>
              <Sparkles className="w-5 h-5 text-black dark:text-white stroke-[2.5]" />
            </div>

            <h3 className="text-xl font-black font-mono text-black dark:text-white mb-2">
              NVIDIA DiffusionGemma 26B
            </h3>

            <p className="text-xs text-slate-800 dark:text-slate-200 font-mono leading-relaxed font-bold">
              Integrated via the NVIDIA API Catalog to perform semantic visual forensics. Inspects macroscopic features including lighting consistency, texture plausibility, and perspective anomalies.
            </p>

            <div className="my-3 p-3 rounded-lg bg-black text-[#FFE600] font-mono font-bold text-xs border border-black leading-relaxed">
              "Checks lighting gradients, masking artifacts, and anatomic coherence."
            </div>

            <p className="text-xs text-slate-800 dark:text-slate-200 font-mono leading-relaxed font-bold">
              Provides real-time natural language reasoning alongside mathematical confidence scores.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-black/10 dark:border-white/10 text-[11px] font-mono font-bold text-slate-600 dark:text-slate-400">
            Google DiffusionGemma 26B-IT • NVIDIA NIM Inference Microservice
          </div>
        </div>
      </div>

      {/* Step 3: Fused Ensemble Average Formula */}
      <div className="glass-brutal rounded-xl p-6 sm:p-8 shadow-[8px_8px_0px_#000000]">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded bg-[#00F5A0] text-black font-mono font-black text-xs border-2 border-black shadow-[2px_2px_0px_#000000]">
            CONSENSUS ENGINE
          </span>
          <h3 className="text-lg sm:text-xl font-black font-mono text-black dark:text-white">
            Dual-Layer Weighted Ensemble Formula
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-100 font-mono leading-relaxed font-bold mb-4">
          To achieve robust resilience against both photorealistic synthetic images and noisy real-world screenshots, the system mathematically averages both detection layers:
        </p>

        <div className="p-4 rounded-xl bg-black text-white font-mono font-black text-sm border-2 border-black dark:border-white shadow-[4px_4px_0px_#000000] overflow-x-auto">
          <span className="text-[#00F5A0]">P(Fake)_Ensemble</span> = <span className="text-[#00F0FF]">0.50 × P(Fake)_Fourier</span> + <span className="text-[#FFE600]">0.50 × P(Fake)_NVIDIA_Vision</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
          <div className="flex items-start gap-2">
            <span className="text-[#059669] dark:text-[#00F5A0] font-black">✓</span>
            <span>Eliminates false positives on compressed screenshots through semantic validation.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#059669] dark:text-[#00F5A0] font-black">✓</span>
            <span>Catches photorealistic AI portraits through sub-pixel Fourier frequency shelf detection.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
