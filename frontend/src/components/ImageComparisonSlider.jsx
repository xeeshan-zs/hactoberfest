import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Sliders, Crosshair } from 'lucide-react';

export default function ImageComparisonSlider({ originalImage, fftImage, filename }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [coords, setCoords] = useState({ u: 0, v: 0 });
  const containerRef = useRef(null);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percent);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging || !e.touches[0]) return;
    handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const relY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setCoords({
      u: Math.round(relX * 256),
      v: Math.round(relY * 256),
    });

    if (isDragging) {
      handleMove(e.clientX);
    }
  }, [isDragging, handleMove]);

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  return (
    <div className="glass-brutal rounded-xl p-3.5 sm:p-5 flex flex-col shadow-[6px_6px_0px_#000000] sm:shadow-[8px_8px_0px_#000000]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 mb-3 sm:mb-4 border-b-2 border-white/30">
        <div className="flex items-center gap-2">
          <span className="px-2.5 sm:px-3 py-1 rounded bg-[#FFE600] text-black font-mono font-black text-xs border-2 border-black shadow-[2px_2px_0px_#FFFFFF]">
            SPLIT LENS
          </span>
          <span className="text-xs font-mono font-black text-white uppercase tracking-wide">
            Spatial ↔ 2D FFT Harmonics
          </span>
        </div>

        {/* Live Coordinate Badge */}
        <div className="hidden xs:flex sm:flex items-center gap-1.5 font-mono text-[11px] sm:text-xs font-bold bg-black px-2.5 sm:px-3 py-1 rounded border-2 border-white text-white shadow-[2px_2px_0px_#000000] self-start sm:self-auto">
          <Crosshair className="w-3.5 h-3.5 text-[#FFE600] stroke-[3]" />
          <span>FREQ: u={coords.u >= 0 ? `+${coords.u}` : coords.u}, v={coords.v >= 0 ? `+${coords.v}` : coords.v}</span>
        </div>
      </div>

      {/* Viewport with touch-none to enable smooth sliding on mobile */}
      <div
        ref={containerRef}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative aspect-[4/3] sm:aspect-[16/9] w-full rounded-lg overflow-hidden bg-black border-2 border-white cursor-ew-resize select-none shadow-[4px_4px_0px_#000000] touch-none"
      >
        {/* Under Layer: FFT Spectrum */}
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <img
            src={fftImage}
            alt="2D FFT Spectrum"
            className="w-full h-full object-contain pointer-events-none"
          />
          <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 bg-black/90 px-2 sm:px-3 py-1 sm:py-1.5 rounded border border-[#00F0FF] text-[10px] sm:text-xs font-mono font-black text-[#00F0FF] shadow-[2px_2px_0px_#000000]">
            2D FFT log(1+|F|)
          </div>
        </div>

        {/* Top Layer: Spatial Image */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
        >
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <img
              src={originalImage}
              alt="Original"
              className="w-full h-full object-contain pointer-events-none"
            />
          </div>
          <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-black/90 px-2 sm:px-3 py-1 sm:py-1.5 rounded border border-[#00F5A0] text-[10px] sm:text-xs font-mono font-black text-[#00F5A0] shadow-[2px_2px_0px_#000000]">
            Spatial (RGB)
          </div>
        </div>

        {/* Divider Beam & Handle */}
        <div
          className="absolute top-0 bottom-0 w-[3px] bg-[#FFE600] shadow-[0_0_15px_#FFE600] z-20 pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 sm:w-9 sm:h-9 rounded-md bg-[#FFE600] border-2 border-black shadow-[3px_3px_0px_#FFFFFF] flex items-center justify-center text-black font-mono font-black text-sm">
            ↔
          </div>
        </div>
      </div>

      {/* Footer Instructions */}
      <div className="mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 border-t-2 border-white/20 flex items-center justify-between text-[11px] sm:text-xs font-mono text-white font-bold">
        <span>Slide horizontally to compare</span>
        <span className="font-black text-[#FFE600]">{Math.round(sliderPosition)}%</span>
      </div>
    </div>
  );
}
