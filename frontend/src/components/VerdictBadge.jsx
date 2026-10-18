import React from 'react';
import { ShieldCheck, AlertOctagon, Layers, Sparkles, Cpu, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function VerdictBadge({ result }) {
  if (!result) return null;

  const isFake = result.prediction?.toLowerCase() === 'fake' || result.prediction?.toLowerCase() === 'ai';
  const confidencePercent = Math.round((result.confidence || 0) * 100);
  const diagnostics = result.diagnostics || {};
  const alpha = diagnostics.spectral_slope_alpha || 1.8;
  const hfRatio = diagnostics.high_freq_ratio !== undefined ? Math.round(diagnostics.high_freq_ratio * 100) : 45;

  const ensemble = result.ensemble || {};
  const activeEngine = ensemble.active_engine || 'ENSEMBLE';
  const fallbackNotice = ensemble.fallback_notice;
  const localModel = result.local_model;
  const nvidia = result.nvidia_vision;

  const isSingleModel = activeEngine !== 'ENSEMBLE';

  return (
    <div className={`relative overflow-hidden rounded-xl border-3 p-4 sm:p-7 backdrop-blur-2xl transition-all ${
      isFake
        ? 'bg-[#FFF1F2] dark:bg-[#180A10] border-[#FF2E63] shadow-[6px_6px_0px_#000000] sm:shadow-[8px_8px_0px_#000000] dark:shadow-[6px_6px_0px_#FF2E63]'
        : 'bg-[#ECFDF5] dark:bg-[#061A12] border-[#00F5A0] dark:border-[#00F5A0] shadow-[6px_6px_0px_#000000] sm:shadow-[8px_8px_0px_#000000] dark:shadow-[6px_6px_0px_#00F5A0]'
    }`}>
      {/* Top Banner Tag */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 sm:pb-4 mb-3 sm:mb-4 border-b-2 border-black/20 dark:border-white/30">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg border-2 border-black font-mono font-black text-[11px] sm:text-xs uppercase shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_#FFFFFF] ${
            isFake ? 'bg-[#FF2E63] text-white' : 'bg-[#00F5A0] text-black'
          }`}>
            {isFake ? '⚠ SYNTHETIC DETECTED' : '✓ AUTHENTIC PHOTO'}
          </span>

          <span className="text-[11px] sm:text-xs font-mono font-black text-black dark:text-white">
            {activeEngine === 'ENSEMBLE' && '// DUAL-LAYER ENSEMBLE'}
            {activeEngine === 'FOURIER_ONLY' && '// 2D FOURIER PHYSICS'}
            {activeEngine === 'NIM_ONLY' && '// NVIDIA VISION FORENSICS'}
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] sm:text-xs font-bold self-start sm:self-auto">
          <span className={`px-2.5 sm:px-3 py-0.5 sm:py-1 rounded border-2 border-black font-black shadow-[2px_2px_0px_#000000] ${
            activeEngine === 'ENSEMBLE'
              ? 'bg-[#FFE600] text-black'
              : 'bg-[#00F0FF] text-black'
          }`}>
            {activeEngine === 'ENSEMBLE' ? '⚡ DUAL MODEL' : '🔬 SINGLE MODEL'}
          </span>
          <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded bg-white dark:bg-black border-2 border-black dark:border-white text-black dark:text-white font-black">
            {result.processing_time_ms || 0}ms
          </span>
        </div>
      </div>

      {/* Main Verdict Content */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
        {/* Left Headline */}
        <div className="flex items-start gap-3 sm:gap-5">
          <div className={`p-2.5 sm:p-4 rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000] sm:shadow-[4px_4px_0px_#000000] dark:shadow-[3px_3px_0px_#FFFFFF] flex-shrink-0 ${
            isFake ? 'bg-[#FF2E63] text-white' : 'bg-[#00F5A0] text-black'
          }`}>
            {isFake ? (
              <AlertOctagon className="w-7 h-7 sm:w-10 sm:h-10 stroke-[3]" />
            ) : (
              <ShieldCheck className="w-7 h-7 sm:w-10 sm:h-10 stroke-[3]" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[11px] sm:text-xs font-mono font-black uppercase text-[#B45309] dark:text-[#FFE600] tracking-wider flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                {activeEngine === 'ENSEMBLE'
                  ? 'Weighted Average (2 Models)'
                  : `Single Model: ${ensemble.active_engine_label || 'Active Engine'}`}
              </span>
            </div>

            <h2 className={`text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-black font-mono tracking-tight leading-none ${
              isFake ? 'text-[#E11D48] dark:text-[#FF2E63]' : 'text-[#059669] dark:text-[#00F5A0]'
            }`}>
              {isFake ? 'AI-GENERATED' : 'AUTHENTIC / REAL'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-900 dark:text-white font-mono mt-2 sm:mt-2.5 max-w-2xl leading-relaxed font-bold">
              {isFake
                ? 'Generative synthesis detected. Frequency slope anomalies and/or neural visual artifacts isolated across active inspection layers.'
                : 'Authentic photographic capture confirmed. Obeys natural Poisson-Gaussian sensor physics and scene coherence.'}
            </p>

            {/* Individual Layer Telemetry Chips */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-3 sm:mt-4 text-[11px] sm:text-xs font-mono font-black">
              {localModel && localModel.available && localModel.prediction && (
                <span className="px-2.5 sm:px-3 py-1 rounded bg-white dark:bg-[#181824] border-2 border-black dark:border-white text-black dark:text-white shadow-[2px_2px_0px_#000000] flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-[#0284C7] dark:text-[#00F0FF]" />
                  Fourier: {localModel.prediction?.toUpperCase()} ({Math.round(localModel.confidence * 100)}%)
                </span>
              )}

              {nvidia && nvidia.available && (
                <span className="px-2.5 sm:px-3 py-1 rounded bg-white dark:bg-[#181824] border-2 border-black dark:border-white text-black dark:text-white shadow-[2px_2px_0px_#000000] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#B45309] dark:text-[#FFE600]" />
                  NVIDIA Vision: {nvidia.prediction?.toUpperCase()} ({Math.round(nvidia.confidence * 100)}%)
                </span>
              )}

              <span className="px-2.5 sm:px-3 py-1 rounded bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0px_#000000]">
                SLOPE: α = {alpha}
              </span>
            </div>
          </div>
        </div>

        {/* Right Certainty Box */}
        <div className="bg-white dark:bg-black p-4 sm:p-5 rounded-xl border-2 border-black dark:border-white shadow-[4px_4px_0px_#000000] sm:shadow-[5px_5px_0px_#000000] dark:shadow-[4px_4px_0px_#FFFFFF] flex flex-col justify-between w-full lg:w-auto lg:min-w-[240px]">
          <span className="text-[11px] sm:text-xs font-mono font-black text-black dark:text-white uppercase tracking-widest mb-1">
            {activeEngine === 'ENSEMBLE' ? 'ENSEMBLE CERTAINTY' : 'MODEL CERTAINTY'}
          </span>

          <div className="flex items-baseline gap-2 mb-2">
            <span className={`text-3xl sm:text-5xl font-black font-mono ${
              isFake ? 'text-[#E11D48] dark:text-[#FF2E63]' : 'text-[#059669] dark:text-[#00F5A0]'
            }`}>
              {confidencePercent}%
            </span>
            <span className="text-[11px] sm:text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
              {activeEngine === 'ENSEMBLE' ? 'WEIGHTED' : 'SINGLE'}
            </span>
          </div>

          {/* Hard Segmented Bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 sm:h-3.5 rounded border-2 border-black dark:border-white overflow-hidden flex">
            <div
              className="bg-[#00F5A0] h-full"
              style={{ width: `${isFake ? 100 - confidencePercent : confidencePercent}%` }}
              title="Real"
            />
            <div
              className="bg-[#FF2E63] h-full"
              style={{ width: `${isFake ? confidencePercent : 100 - confidencePercent}%` }}
              title="Fake"
            />
          </div>

          <div className="flex justify-between text-[11px] sm:text-xs font-mono font-black mt-2">
            <span className="text-[#059669] dark:text-[#00F5A0]">Real: {isFake ? 100 - confidencePercent : confidencePercent}%</span>
            <span className="text-[#E11D48] dark:text-[#FF2E63]">Synth: {isFake ? confidencePercent : 100 - confidencePercent}%</span>
          </div>
        </div>
      </div>

      {/* Fallback Single-Model Notice Banner */}
      {fallbackNotice && (
        <div className="mt-4 p-3.5 rounded-lg border-2 border-black dark:border-[#00F0FF] bg-[#E0F2FE] dark:bg-[#082F49] shadow-[3px_3px_0px_#000000] flex items-start gap-2.5 text-xs font-mono font-bold text-slate-900 dark:text-white">
          <AlertTriangle className="w-4 h-4 text-[#0284C7] dark:text-[#38BDF8] flex-shrink-0 mt-0.5 stroke-[2.5]" />
          <div>
            <span className="font-black text-[#0369A1] dark:text-[#38BDF8] uppercase mr-1">
              Single-Model Operation Notice:
            </span>
            <span>{fallbackNotice}</span>
          </div>
        </div>
      )}
    </div>
  );
}
