import React, { useRef, useState, useCallback, useEffect } from 'react';
import { UploadCloud, Loader2, ArrowUpRight, Clipboard } from 'lucide-react';

export default function Dropzone({ onFileSelected, loading, currentPreview, loadingMessage }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    setIsDragOver(false);
    if (!loading && event.dataTransfer.files?.[0]) onFileSelected(event.dataTransfer.files[0]);
  }, [onFileSelected, loading]);

  useEffect(() => {
    function handlePaste(event) {
      if (loading || /INPUT|TEXTAREA/.test(event.target.tagName) || event.target.isContentEditable) return;
      const item = Array.from(event.clipboardData?.items || []).find(item => item.type.startsWith('image/'));
      const image = item?.getAsFile();
      if (image) onFileSelected(image);
    }
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [onFileSelected, loading]);

  const selectImage = () => { if (!loading) fileInputRef.current?.click(); };

  return (
    <section className="space-y-3" aria-label="Image upload">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">Start an inspection</h2>
        <span className="text-[10px] font-mono tracking-wide text-slate-500 dark:text-slate-400">PNG · JPG · WEBP</span>
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" disabled={loading} className="hidden" aria-label="Choose image file"
        onChange={event => { if (event.target.files?.[0]) onFileSelected(event.target.files[0]); event.target.value = ''; }} />
      <div role="button" tabIndex={loading ? -1 : 0} aria-label="Upload an image" aria-disabled={loading} aria-busy={loading}
        onClick={selectImage}
        onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectImage(); } }}
        onDragOver={event => { event.preventDefault(); if (!loading) setIsDragOver(true); }}
        onDragLeave={event => { if (!event.currentTarget.contains(event.relatedTarget)) setIsDragOver(false); }}
        onDrop={handleDrop}
        className={`upload-surface rounded-2xl relative overflow-hidden ${isDragOver ? 'is-dragging' : ''} ${loading ? 'is-loading' : 'cursor-pointer'}`}>
        {loading ? (
          <div className="p-7 sm:p-10 flex flex-col items-center text-center gap-4" role="status" aria-live="polite">
            {currentPreview && <img src={currentPreview} alt="Image being analyzed" className="w-24 h-24 object-cover rounded-xl border border-black/15 dark:border-white/20" />}
            <div className="flex items-center gap-2 text-sm font-bold"><Loader2 className="w-4 h-4 animate-spin" /> Inspecting your image</div>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md leading-relaxed">{loadingMessage || 'Preparing the image analysis…'}</p>
            <div className="inspection-progress" aria-hidden="true"><span /></div>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Results will appear here when the analysis is ready.</span>
          </div>
        ) : (
          <div className="p-7 sm:p-10 flex flex-col items-center text-center">
            <div className="upload-icon mb-5"><UploadCloud className="w-7 h-7 stroke-[1.8]" /></div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">{isDragOver ? 'Drop it here.' : 'Drop an image. Look closer.'}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Drag a file here, or browse your device.</p>
            <span className="upload-cta mt-6">Choose an image <ArrowUpRight className="w-4 h-4" /></span>
            <span className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-5"><Clipboard className="w-3 h-3" /> Or paste an image with Ctrl + V</span>
          </div>
        )}
      </div>
      <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center leading-relaxed px-3">Analysis provides signals, not proof of authenticity. AI analysis uses the configured external services.</p>
    </section>
  );
}
