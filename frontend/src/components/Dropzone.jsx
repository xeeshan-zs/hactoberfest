import React, { useRef, useState, useCallback, useEffect } from 'react';
import { UploadCloud, Sparkles } from 'lucide-react';

export default function Dropzone({ onFileSelected, loading, currentPreview, loadingMessage }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onFileSelected(file);
      }
    }
  }, [onFileSelected]);

  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) onFileSelected(blob);
          break;
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [onFileSelected]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onFileSelected(file);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !loading && fileInputRef.current?.click()}
        className={`relative group cursor-pointer rounded-xl border-3 border-dashed transition-all duration-150 overflow-hidden ${
          isDragOver
            ? 'border-black dark:border-[#FFE600] bg-[#FFFBEB] dark:bg-black shadow-[6px_6px_0px_#FFE600] translate-x-[-2px] translate-y-[-2px]'
            : 'border-black dark:border-white bg-white dark:bg-[#0E0E14] hover:bg-[#FFFBEB] dark:hover:bg-black shadow-[6px_6px_0px_#000000]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 z-30 pointer-events-none bg-white/95 dark:bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6 text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#FFE600] border-2 border-black shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#FFFFFF] flex items-center justify-center animate-bounce mb-3">
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-black stroke-[3]" />
            </div>
            <span className="text-sm sm:text-lg font-mono font-black tracking-wider text-black dark:text-white max-w-sm">
              {loadingMessage || 'EXTRACTING 2D FOURIER HARMONICS...'}
            </span>
            <span className="text-[11px] sm:text-xs font-mono font-black text-[#059669] dark:text-[#FFE600] mt-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00F5A0] animate-ping" />
              Evaluating Multi-Spectral Classifier Pipeline
            </span>
          </div>
        )}

        <div className="p-6 sm:p-12 flex flex-col items-center justify-center text-center">
          {/* Upload Icon Box */}
          <div className="w-13 h-13 sm:w-16 sm:h-16 mb-3 sm:mb-4 rounded-xl bg-[#FFE600] border-2 border-black shadow-[3px_3px_0px_#000000] sm:shadow-[4px_4px_0px_#000000] dark:shadow-[3px_3px_0px_#FFFFFF] flex items-center justify-center text-black group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] transition-transform">
            <UploadCloud className="w-7 h-7 sm:w-9 sm:h-9 text-black stroke-[3]" />
          </div>

          <h3 className="text-lg sm:text-2xl font-black text-black dark:text-white mb-2 font-mono tracking-tight leading-snug">
            TAP TO SELECT IMAGE OR <span className="underline underline-offset-4 decoration-4 text-black dark:text-[#FFE600]">DROP FILE</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-100 font-mono max-w-md mb-4 sm:mb-5 font-bold">
            Camera photo, Gallery, PNG, JPEG, WEBP. Paste with <kbd className="px-1.5 sm:px-2.5 py-0.5 rounded bg-black text-white dark:bg-white dark:text-black font-black border-2 border-black shadow-[1px_1px_0px_#FFE600]">CTRL+V</kbd>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 text-[11px] sm:text-xs font-mono font-black">
            <span className="px-2.5 sm:px-3 py-1 rounded bg-slate-100 dark:bg-[#181824] text-black dark:text-white border-2 border-black dark:border-white shadow-[2px_2px_0px_#000000]">
              2D FFT Spectrum
            </span>
            <span className="px-2.5 sm:px-3 py-1 rounded bg-slate-100 dark:bg-[#181824] text-black dark:text-white border-2 border-black dark:border-white shadow-[2px_2px_0px_#000000]">
              Multi-Spectral
            </span>
            <span className="px-2.5 sm:px-3 py-1 rounded bg-[#00F5A0] text-black border-2 border-black shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_#FFFFFF]">
              Dual Model
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
