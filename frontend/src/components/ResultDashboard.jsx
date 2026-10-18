import React, { useState } from 'react';
import { Eye, Activity, Crosshair, ArrowRightLeft, Sliders, LineChart, Download, Copy, Check } from 'lucide-react';
import VerdictBadge from './VerdictBadge';
import ApiComparison from './ApiComparison';
import RadialProfileChart from './RadialProfileChart';
import ImageComparisonSlider from './ImageComparisonSlider';
import ForensicMetrics from './ForensicMetrics';

export default function ResultDashboard({ result, originalImagePreview, onReset }) {
  const [activeTab, setActiveTab] = useState('dual'); // 'dual' | 'slider' | 'chart'
  const [copied, setCopied] = useState(false);
  const [showReticle, setShowReticle] = useState(true);

  if (!result) return null;

  const isFake = result.prediction?.toLowerCase() === 'fake' || result.prediction?.toLowerCase() === 'ai';

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSpectrum = () => {
    if (!result.fft_spectrum_image) return;
    const link = document.createElement('a');
    link.href = result.fft_spectrum_image;
    link.download = `fft_spectrum_${result.filename || 'image'}.png`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* 1. Hero Verdict Badge */}
      <VerdictBadge result={result} />

      {/* 2. Forensic Metrics */}
      <ForensicMetrics result={result} />

      {/* 3. Studio Multi-Lens Container */}
      <div className="glass-brutal rounded-xl overflow-hidden shadow-[6px_6px_0px_#000000] sm:shadow-[8px_8px_0px_#000000]">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-3.5 sm:px-5 py-3 sm:py-4 bg-white dark:bg-black border-b-2 border-black dark:border-white">
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-3 gap-1.5 sm:flex sm:items-center sm:gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('dual')}
              className={`px-2.5 sm:px-4 py-2 rounded-lg text-xs font-mono font-black border-2 transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer ${
                activeTab === 'dual'
                  ? 'bg-[#FFE600] text-black border-black shadow-[2px_2px_0px_#000000] sm:shadow-[3px_3px_0px_#000000] dark:shadow-[2px_2px_0px_#FFFFFF]'
                  : 'bg-white dark:bg-[#181824] text-black dark:text-white border-black dark:border-white hover:bg-[#FFE600] hover:text-black'
              }`}
            >
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
              <span className="truncate">DUAL GRID</span>
            </button>

            <button
              onClick={() => setActiveTab('slider')}
              className={`px-2.5 sm:px-4 py-2 rounded-lg text-xs font-mono font-black border-2 transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer ${
                activeTab === 'slider'
                  ? 'bg-[#FFE600] text-black border-black shadow-[2px_2px_0px_#000000] sm:shadow-[3px_3px_0px_#000000] dark:shadow-[2px_2px_0px_#FFFFFF]'
                  : 'bg-white dark:bg-[#181824] text-black dark:text-white border-black dark:border-white hover:bg-[#FFE600] hover:text-black'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
              <span className="truncate">SPLIT</span>
            </button>

            <button
              onClick={() => setActiveTab('chart')}
              className={`px-2.5 sm:px-4 py-2 rounded-lg text-xs font-mono font-black border-2 transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer ${
                activeTab === 'chart'
                  ? 'bg-[#FFE600] text-black border-black shadow-[2px_2px_0px_#000000] sm:shadow-[3px_3px_0px_#000000] dark:shadow-[2px_2px_0px_#FFFFFF]'
                  : 'bg-white dark:bg-[#181824] text-black dark:text-white border-black dark:border-white hover:bg-[#FFE600] hover:text-black'
              }`}
            >
              <LineChart className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
              <span className="truncate">1D DECAY</span>
            </button>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center justify-between sm:justify-end gap-1.5 sm:gap-2.5 w-full sm:w-auto pt-1 sm:pt-0 border-t sm:border-t-0 border-black/10 dark:border-white/10">
            <button
              onClick={handleCopyJson}
              className="flex-1 sm:flex-initial px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg bg-white dark:bg-[#181824] text-black dark:text-white border-2 border-black dark:border-white hover:bg-[#FFE600] hover:text-black hover:border-black text-xs font-mono font-black flex items-center justify-center gap-1 sm:gap-1.5 shadow-[2px_2px_0px_#000000] cursor-pointer"
              title="Copy JSON Payload"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#059669] stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'COPIED' : 'JSON'}</span>
            </button>

            <button
              onClick={handleDownloadSpectrum}
              className="flex-1 sm:flex-initial px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg bg-white dark:bg-[#181824] text-black dark:text-white border-2 border-black dark:border-white hover:bg-[#FFE600] hover:text-black hover:border-black text-xs font-mono font-black flex items-center justify-center gap-1 sm:gap-1.5 shadow-[2px_2px_0px_#000000] cursor-pointer"
              title="Download FFT PNG"
            >
              <Download className="w-3.5 h-3.5" />
              <span>EXPORT FFT</span>
            </button>

            <button
              onClick={onReset}
              className="flex-1 sm:flex-initial px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-[#FFE600] text-black border-2 border-black text-xs font-mono font-black flex items-center justify-center gap-1 sm:gap-1.5 shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_#FFFFFF] cursor-pointer"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 stroke-[3]" />
              <span className="truncate">NEW</span>
            </button>
          </div>
        </div>

        {/* Viewport Content */}
        <div className="p-3.5 sm:p-6">
          {activeTab === 'slider' && (
            <ImageComparisonSlider
              originalImage={originalImagePreview}
              fftImage={result.fft_spectrum_image}
              filename={result.filename}
            />
          )}

          {activeTab === 'dual' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Input Image */}
              <div className="glass-brutal-card rounded-xl p-5 flex flex-col justify-between border-2 border-black dark:border-white shadow-[6px_6px_0px_#000000] bg-white dark:bg-[#14141E]">
                <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b-2 border-black/10 dark:border-white/20">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded bg-[#00F5A0] text-black font-mono font-black text-xs border-2 border-black shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_#FFFFFF]">
                      SPATIAL
                    </span>
                    <span className="text-xs font-mono font-black text-black dark:text-white uppercase tracking-wide">
                      Pixel Domain (RGB)
                    </span>
                  </div>
                  <span className="text-xs font-mono font-black text-black dark:text-white truncate max-w-[200px] bg-slate-100 dark:bg-black px-2.5 py-0.5 rounded border border-black dark:border-white/50">
                    {result.filename || 'image.png'}
                  </span>
                </div>

                <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-black border-2 border-black dark:border-white flex items-center justify-center">
                  <img
                    src={originalImagePreview}
                    alt="Input"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute bottom-3 left-3 bg-black px-3 py-1.5 rounded text-xs font-mono font-black text-[#00F5A0] border-2 border-[#00F5A0] shadow-[3px_3px_0px_#000000]">
                    RGB Matrix
                  </div>
                </div>

                <p className="mt-4 text-xs text-slate-800 dark:text-white font-mono leading-relaxed font-bold">
                  Natural human visual domain. High-frequency neural upsampling and latent noise are often imperceptible to the naked eye.
                </p>
              </div>

              {/* Right: FFT Spectrum */}
              <div className="glass-brutal-card rounded-xl p-5 flex flex-col justify-between border-2 border-black dark:border-white shadow-[6px_6px_0px_#000000] bg-white dark:bg-[#14141E]">
                <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b-2 border-black/10 dark:border-white/20">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded bg-[#00F0FF] text-black font-mono font-black text-xs border-2 border-black shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_#FFFFFF]">
                      SPECTRAL
                    </span>
                    <span className="text-xs font-mono font-black text-black dark:text-white uppercase tracking-wide">
                      2D FFT Magnitude Spectrum
                    </span>
                  </div>
                  <button
                    onClick={() => setShowReticle(!showReticle)}
                    className="text-xs font-mono font-black text-black dark:text-[#FFE600] bg-slate-100 dark:bg-black px-2.5 py-1 rounded border-2 border-black dark:border-white hover:bg-[#FFE600] hover:text-black transition-colors flex items-center gap-1.5 shadow-[1px_1px_0px_#000000]"
                  >
                    <Crosshair className="w-4 h-4 stroke-[3]" />
                    <span>{showReticle ? 'RETICLE: ON' : 'RETICLE: OFF'}</span>
                  </button>
                </div>

                <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-black border-2 border-black dark:border-white flex items-center justify-center">
                  <img
                    src={result.fft_spectrum_image}
                    alt="FFT Spectrum"
                    className="w-full h-full object-contain"
                  />

                  {/* Reticle Guides */}
                  {showReticle && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="w-full h-[2px] bg-[#00F0FF]/50" />
                      <div className="h-full w-[2px] bg-[#00F0FF]/50 absolute" />
                      <div className="w-1/3 h-1/3 rounded-full border-2 border-[#00F0FF]/50 absolute" />
                      <div className="w-2/3 h-2/3 rounded-full border-2 border-[#00F0FF]/40 absolute" />
                      <div className="w-[95%] h-[95%] rounded-full border-2 border-dashed border-[#00F0FF]/35 absolute" />
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 bg-black px-3 py-1.5 rounded text-xs font-mono font-black text-[#00F0FF] border-2 border-[#00F0FF] shadow-[3px_3px_0px_#000000]">
                    Inferno Spectrum log(1+|F(u,v)|)
                  </div>
                </div>

                <p className="mt-4 text-xs text-slate-800 dark:text-white font-mono leading-relaxed font-bold">
                  Centered zero frequency (DC). Latent diffusion &amp; GAN models manifest elevated energy shelves along outer radii and periodic harmonic cross-spikes.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'chart' && (
            <RadialProfileChart
              diagnostics={result.diagnostics}
              isFake={isFake}
            />
          )}
        </div>
      </div>

      {/* 4. Commercial Consensus */}
      <ApiComparison result={result} />
    </div>
  );
}
