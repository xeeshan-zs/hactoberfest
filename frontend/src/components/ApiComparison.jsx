import React from 'react';
import { Cpu, Sparkles, AlertTriangle, ShieldCheck, Layers, ArrowRight, XCircle } from 'lucide-react';

export default function ApiComparison({ result }) {
  if (!result) return null;

  const localModel = result.local_model;
  const fourierAvailable = localModel?.available !== false && localModel?.prediction;
  const ourModelVerdict = localModel?.prediction?.toLowerCase() || result.prediction?.toLowerCase();
  const ourConfidence = Math.round((localModel?.confidence || result.confidence || 0) * 100);

  // NVIDIA DiffusionGemma 26B Vision
  const nvidia = result.nvidia_vision;
  const hasNvidia = nvidia && nvidia.available;
  const nvidiaVerdict = nvidia?.prediction?.toLowerCase();
  const nvidiaConfidence = hasNvidia ? Math.round((nvidia.confidence || 0.85) * 100) : null;
  const nvidiaExplanation = nvidia?.explanation || 'Multi-modal vision analysis completed.';

  const ensemble = result.ensemble || {};
  const activeEngine = ensemble.active_engine || 'ENSEMBLE';
  const isBothActive = activeEngine === 'ENSEMBLE';
  const isNvidiaAgreement = hasNvidia && fourierAvailable && ourModelVerdict === nvidiaVerdict;

  return (
    <div className="glass-brutal rounded-xl p-6 shadow-[8px_8px_0px_#000000]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b-2 border-black/20 dark:border-white/30">
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 rounded bg-[#FFE600] text-black font-mono font-black text-xs border-2 border-black shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_#FFFFFF]">
            MULTI-MODEL CONSENSUS
          </span>
          <span className="text-xs font-mono font-black text-black dark:text-white uppercase tracking-wide">
            2D FFT Physics Engine ↔ NVIDIA DiffusionGemma 26B Vision
          </span>
        </div>

        {isBothActive ? (
          <span className={`text-xs font-mono px-3.5 py-1.5 rounded-lg border-2 border-black font-black shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_#FFFFFF] ${
            isNvidiaAgreement
              ? 'bg-[#00F5A0] text-black'
              : 'bg-[#FFE600] text-black'
          }`}>
            {isNvidiaAgreement ? '✓ DUAL MODEL CONSENSUS MATCH' : '⚡ DIVERGENT MODEL HYPOTHESIS'}
          </span>
        ) : (
          <span className="text-xs font-mono px-3.5 py-1.5 rounded-lg bg-[#00F0FF] text-black border-2 border-black font-black shadow-[2px_2px_0px_#000000]">
            🔬 {ensemble.active_engine_label || 'SINGLE MODEL ACTIVE'}
          </span>
        )}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Local 2D Fourier Model */}
        <div className={`border-2 rounded-xl p-5 flex flex-col justify-between shadow-[4px_4px_0px_#000000] ${
          fourierAvailable
            ? 'bg-[#F8F9FA] dark:bg-black border-black dark:border-white'
            : 'bg-slate-100 dark:bg-[#101018] border-dashed border-slate-400 dark:border-slate-700 opacity-60'
        }`}>
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-black dark:text-white mb-2.5">
              <span className="text-[#0284C7] dark:text-[#00F0FF] font-black flex items-center gap-1.5">
                <Cpu className="w-4 h-4 stroke-[3]" />
                LOCAL 2D FOURIER MODEL {isBothActive ? '(WEIGHT: 50%)' : '(ACTIVE: 100%)'}
              </span>
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000000] ${
                fourierAvailable ? 'bg-[#00F0FF] text-black' : 'bg-slate-300 text-slate-700'
              }`}>
                {fourierAvailable ? 'Physics Layer Active' : 'Offline'}
              </span>
            </div>

            {fourierAvailable ? (
              <>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className={`text-3xl sm:text-4xl font-black font-mono uppercase ${
                    ourModelVerdict === 'fake' ? 'text-[#E11D48] dark:text-[#FF2E63]' : 'text-[#059669] dark:text-[#00F5A0]'
                  }`}>
                    {ourModelVerdict === 'fake' ? 'AI-Generated' : 'Authentic / Real'}
                  </span>
                  <span className="text-xs font-mono text-slate-700 dark:text-slate-300 font-black">({ourConfidence}% Certainty)</span>
                </div>

                <p className="text-xs text-slate-800 dark:text-slate-200 font-mono leading-relaxed font-bold">
                  Evaluated on 40-dimensional azimuthal harmonic power decay, α slope roll-off, and cross-channel chromatic phase coherence.
                </p>
              </>
            ) : (
              <div className="py-4 text-xs font-mono font-bold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <span>Local 2D Fourier model file not loaded.</span>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t-2 border-black/10 dark:border-white/20 flex items-center justify-between text-xs font-mono font-bold">
            <span className="text-slate-700 dark:text-slate-300">Signal Layer:</span>
            <span className="text-[#059669] dark:text-[#00F5A0] font-black">Sub-Pixel Spectral Harmonics</span>
          </div>
        </div>

        {/* Card 2: NVIDIA DiffusionGemma 26B Vision */}
        <div className={`border-2 rounded-xl p-5 flex flex-col justify-between shadow-[4px_4px_0px_#000000] ${
          hasNvidia
            ? 'bg-[#F8F9FA] dark:bg-black border-black dark:border-white'
            : 'bg-slate-100 dark:bg-[#101018] border-dashed border-slate-400 dark:border-slate-700'
        }`}>
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-black dark:text-white mb-2.5">
              <span className="text-[#B45309] dark:text-[#FFE600] font-black flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#FFE600] fill-[#FFE600]" />
                NVIDIA DIFFUSIONGEMMA 26B {isBothActive ? '(WEIGHT: 50%)' : '(ACTIVE: 100%)'}
              </span>
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000000] ${
                hasNvidia ? 'bg-[#FFE600] text-black' : 'bg-slate-300 text-slate-700'
              }`}>
                {hasNvidia ? 'Vision Layer Active' : 'Standby / Offline'}
              </span>
            </div>

            {hasNvidia ? (
              <>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className={`text-3xl sm:text-4xl font-black font-mono uppercase ${
                    nvidiaVerdict === 'fake' ? 'text-[#E11D48] dark:text-[#FF2E63]' : 'text-[#059669] dark:text-[#00F5A0]'
                  }`}>
                    {nvidiaVerdict === 'fake' ? 'AI-Generated' : 'Authentic / Real'}
                  </span>
                  <span className="text-xs font-mono text-slate-700 dark:text-slate-300 font-black">({nvidiaConfidence}% Certainty)</span>
                </div>
                <div className="p-3 rounded-lg bg-white dark:bg-[#14141E] border-2 border-black dark:border-white/30 mt-2 shadow-[2px_2px_0px_#000000]">
                  <span className="text-[10px] font-mono text-[#B45309] dark:text-[#FFE600] font-black uppercase tracking-wider block mb-1">
                    AI Visual Forensics Reasoning:
                  </span>
                  <p className="text-xs text-slate-900 dark:text-white font-mono leading-relaxed font-bold">
                    "{nvidiaExplanation}"
                  </p>
                </div>
              </>
            ) : (
              <div className="py-3">
                <span className="text-xs font-mono font-bold text-[#B45309] dark:text-[#FFE600] block mb-1">
                  NVIDIA NIM Model Offline / Key Not Set
                </span>
                <p className="text-xs text-slate-800 dark:text-slate-300 font-mono">
                  Set <code className="text-black dark:text-white bg-slate-200 dark:bg-[#181824] px-1 py-0.5 rounded">NVIDIA_API_KEY</code> in <code className="text-[#B45309] dark:text-[#FFE600]">backend/.env</code> to activate real-time visual reasoning.
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t-2 border-black/10 dark:border-white/20 flex items-center justify-between text-xs font-mono font-bold">
            <span className="text-slate-700 dark:text-slate-300">Signal Layer:</span>
            <span className="text-[#B45309] dark:text-[#FFE600] font-black">
              Semantic Scene Plausibility
            </span>
          </div>
        </div>
      </div>

      {/* Mode / Equation Bar */}
      <div className="mt-4 p-4 rounded-xl border-2 border-black dark:border-white bg-[#FFE600] text-black shadow-[4px_4px_0px_#000000]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 stroke-[2.5]" />
            <span className="text-xs font-black uppercase">
              {isBothActive ? 'Dual-Layer Ensemble Average Mode:' : 'Single-Model Execution Mode:'}
            </span>
          </div>
          <div className="text-xs font-black bg-black text-[#FFE600] px-3 py-1 rounded border border-black flex items-center gap-2">
            {isBothActive ? (
              <>
                <span>0.50 × Physics P(Fake) + 0.50 × NIM P(Fake)</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                <span className="text-white">Final Score: {Math.round((result.confidence || 0) * 100)}% {result.prediction?.toUpperCase()}</span>
              </>
            ) : (
              <span className="text-white">Answered By: {ensemble.active_engine_label || '1 Model'} ({Math.round((result.confidence || 0) * 100)}% Certainty)</span>
            )}
          </div>
        </div>
      </div>

      {/* Divergence Explainer */}
      {isBothActive && hasNvidia && !isNvidiaAgreement && (
        <div className="mt-3 p-4 rounded-xl border-2 border-black dark:border-[#FFE600] bg-[#FFFBEB] dark:bg-[#1A1708] shadow-[4px_4px_0px_#000000]">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded bg-[#FFE600] text-black border border-black font-black flex-shrink-0">
              <AlertTriangle className="w-4 h-4 stroke-[3]" />
            </div>
            <div>
              <span className="text-xs font-mono font-black text-black dark:text-[#FFE600] uppercase block mb-1">
                Forensic Analysis of Divergence:
              </span>
              <p className="text-xs text-slate-900 dark:text-slate-100 font-mono leading-relaxed font-bold">
                {ourModelVerdict === 'fake'
                  ? 'Your local 2D Fourier model detected synthetic upsampling grid harmonics or power-law slope anomalies invisible to the human eye, while NIM evaluated semantic and visual plausibility.'
                  : 'NIM flagged visual or compositional irregularities, while your local Fourier model verified natural optical sensor noise roll-off in the frequency spectrum.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
