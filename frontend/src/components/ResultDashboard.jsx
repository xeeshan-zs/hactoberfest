import React, { useState, useRef, useEffect } from 'react';
import { Eye, Crosshair, Plus, Sliders, LineChart, Download, Copy, Check, FileImage } from 'lucide-react';
import VerdictBadge from './VerdictBadge';
import ApiComparison from './ApiComparison';
import RadialProfileChart from './RadialProfileChart';
import ImageComparisonSlider from './ImageComparisonSlider';
import ForensicMetrics from './ForensicMetrics';

export default function ResultDashboard({ result, originalImagePreview, onReset }) {
  const [activeTab, setActiveTab] = useState('dual');
  const [copyStatus, setCopyStatus] = useState('');
  const [showReticle, setShowReticle] = useState(false);
  const copyTimer = useRef(null);
  useEffect(() => () => clearTimeout(copyTimer.current), []);
  if (!result) return null;
  const isFake = ['fake', 'ai'].includes(result.prediction?.toLowerCase());
  const illustrative = result.ensemble?.active_engine === 'NIM_BROWSER_DIRECT';
  const dimensions = result.diagnostics?.dimensions;
  const tabs = [
    { id: 'dual', label: 'Side by side', icon: Eye },
    { id: 'slider', label: 'Split view', icon: Sliders },
    { id: 'chart', label: 'Frequency chart', icon: LineChart },
  ];
  async function copyJson() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      setCopyStatus('Copied');
    } catch { setCopyStatus('Copy failed. Check browser clipboard permissions.'); }
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopyStatus(''), 3500);
  }
  function downloadSpectrum() {
    if (!result.fft_spectrum_image) return;
    const link = document.createElement('a');
    link.href = result.fft_spectrum_image;
    link.download = `fft_spectrum_${result.filename || 'image'}.png`;
    link.click();
  }
  return <div className="results-workspace space-y-5 sm:space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 pb-1">
      <div className="min-w-0"><p className="results-kicker mb-2">Your inspection report</p><h1 className="flex items-center gap-2 text-lg sm:text-xl font-bold tracking-tight min-w-0"><FileImage className="w-5 h-5 text-slate-400 shrink-0" /><span className="truncate" title={result.filename}>{result.filename || 'Uploaded image'}</span></h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{dimensions?.length === 2 ? `${dimensions[0]} × ${dimensions[1]} pixels` : 'Image inspection'}{typeof result.file_size_kb === 'number' ? ` · ${result.file_size_kb} KB` : ''}</p>
      </div>
      <button onClick={onReset} className="btn-brutal-yellow px-4 py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 shrink-0"><Plus className="w-4 h-4" />New inspection</button>
    </div>
    <VerdictBadge result={result} />
    {illustrative && <p className="result-inline-notice">Browser fallback: the spectrum and diagnostics shown here are illustrative. The vision response is the available model analysis.</p>}
    <ForensicMetrics result={result} />
    <ApiComparison result={result} />
    <section className="results-panel !p-0 overflow-hidden" aria-labelledby="image-inspection-title">
      <div className="flex flex-wrap items-start justify-between gap-4 p-5 sm:p-6 border-b border-black/10 dark:border-white/10">
        <div><p className="results-kicker mb-2">Explore the evidence</p><h2 id="image-inspection-title" className="text-xl font-bold tracking-tight">Look at the image, then its patterns.</h2></div>
        <div className="flex flex-wrap gap-2">
          <button onClick={copyJson} className="results-button">{copyStatus === 'Copied' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}{copyStatus === 'Copied' ? 'Copied' : 'Copy JSON'}</button>
          <button onClick={downloadSpectrum} disabled={!result.fft_spectrum_image} className="results-button"><Download className="w-4 h-4" />Export spectrum</button>
        </div>
      </div>
      {copyStatus && <p role="status" className="px-5 pt-3 text-xs text-slate-500 dark:text-slate-400">{copyStatus}</p>}
      <div className="p-4 sm:p-6">
        <div className="result-tabs mb-5" aria-label="Image inspection views">
          {tabs.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setActiveTab(id)} aria-pressed={activeTab === id} className="result-tab"><Icon className="w-4 h-4 shrink-0" /><span>{label}</span></button>)}
        </div>
        {activeTab === 'dual' && <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <figure className="min-w-0">
            <figcaption className="flex items-center justify-between gap-2 mb-3 min-h-9"><h3 className="text-sm font-semibold">Original image</h3><span className="results-kicker">RGB</span></figcaption>
            <div className="result-image"><img src={originalImagePreview} alt="Uploaded image" className="w-full h-full object-contain" /></div>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">The original view, preserved for your own visual inspection.</p>
          </figure>
          <figure className="min-w-0">
            <figcaption className="flex flex-wrap items-center justify-between gap-2 mb-3 min-h-9"><h3 className="text-sm font-semibold">Frequency spectrum</h3><button onClick={() => setShowReticle(!showReticle)} aria-pressed={showReticle} className="results-button !py-1.5 !text-[10px]"><Crosshair className="w-3.5 h-3.5" />{showReticle ? 'Hide guides' : 'Show guides'}</button></figcaption>
            <div className="result-image relative">
              {result.fft_spectrum_image ? <img src={result.fft_spectrum_image} alt={illustrative ? 'Illustrative frequency visualization' : 'Computed FFT frequency spectrum'} className="w-full h-full object-contain" /> : <p className="p-5 text-sm text-slate-400">No spectrum returned.</p>}
              {showReticle && <div className="absolute inset-0 pointer-events-none flex items-center justify-center" aria-hidden="true"><div className="w-full h-px bg-cyan-300/60" /><div className="absolute h-full w-px bg-cyan-300/60" /><div className="absolute w-2/3 h-2/3 rounded-full border border-cyan-300/60" /><div className="absolute w-1/3 h-1/3 rounded-full border border-cyan-300/60" /></div>}
            </div>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{illustrative ? 'An illustrative rendering from the browser fallback.' : 'Brightness represents frequency magnitude. Patterns alone cannot establish an image’s source.'}</p>
          </figure>
        </div>}
        {activeTab === 'slider' && <ImageComparisonSlider originalImage={originalImagePreview} fftImage={result.fft_spectrum_image} filename={result.filename} />}
        {activeTab === 'chart' && (result.diagnostics?.radial_profile?.length > 1 ? <RadialProfileChart diagnostics={result.diagnostics} isFake={isFake} /> : <p className="text-sm text-slate-500 dark:text-slate-400 py-8 text-center">No frequency profile was returned for this image.</p>)}
      </div>
    </section>
  </div>;
}
