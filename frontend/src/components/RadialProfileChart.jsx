import React, { useState } from 'react';
import { Activity, Info } from 'lucide-react';

export default function RadialProfileChart({ diagnostics, isFake }) {
  const [hoverIndex, setHoverIndex] = useState(null);

  if (!diagnostics || !diagnostics.radial_profile) return null;

  const profile = diagnostics.radial_profile;
  const natural = diagnostics.natural_curve || [];
  const numPoints = profile.length;

  const width = 620;
  const height = 200;
  const padding = { top: 25, right: 30, bottom: 40, left: 45 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const getX = (index) => padding.left + (index / (numPoints - 1)) * graphWidth;
  const getY = (val) => padding.top + (1 - Math.max(0, Math.min(1, val))) * graphHeight;

  const profilePoints = profile.map((v, i) => `${getX(i)},${getY(v)}`).join(' L ');
  const profilePath = `M ${profilePoints}`;
  const areaPath = `M ${profilePoints} L ${getX(numPoints - 1)},${padding.top + graphHeight} L ${padding.left},${padding.top + graphHeight} Z`;

  const naturalPoints = natural.map((v, i) => `${getX(i)},${getY(v)}`).join(' L ');
  const naturalPath = `M ${naturalPoints}`;

  return (
    <div className="glass-brutal rounded-xl p-5 flex flex-col justify-between shadow-[8px_8px_0px_#000000]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 mb-4 border-b-2 border-black/20 dark:border-white/30">
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 rounded bg-[#00F0FF] text-black font-mono font-black text-xs border-2 border-black shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_#FFFFFF]">
            POWER SPECTRUM
          </span>
          <span className="text-xs font-mono font-black text-black dark:text-white uppercase tracking-wide">
            1D Azimuthal Harmonic Decay log|F(r)| vs Natural 1/f² Baseline
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-mono font-black">
          <div className="flex items-center gap-1.5">
            <span className={`w-3.5 h-3.5 rounded border-2 border-black shadow-[1px_1px_0px_#000000] dark:shadow-[1px_1px_0px_#FFFFFF] ${isFake ? 'bg-[#FF2E63]' : 'bg-[#00F5A0]'}`} />
            <span className="text-black dark:text-white">Sample</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1.5 bg-black dark:bg-white border border-black" />
            <span className="text-slate-700 dark:text-slate-200">1/f² Optical Ref</span>
          </div>
        </div>
      </div>

      {/* SVG Container */}
      <div className="relative w-full overflow-hidden bg-[#0A0D14] dark:bg-black p-2 rounded-lg border-2 border-black dark:border-white shadow-[4px_4px_0px_#000000]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id="areaGradientFakeBrutal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF2E63" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#FF2E63" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="areaGradientRealBrutal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00F5A0" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#00F5A0" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = padding.top + ratio * graphHeight;
            return (
              <g key={ratio}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#334155"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding.left - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  className="fill-white font-mono text-[10px] font-black"
                >
                  {(1 - ratio).toFixed(2)}
                </text>
              </g>
            );
          })}

          {/* X Axis Labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const x = padding.left + ratio * graphWidth;
            const labels = ['DC (0)', 'Low-Band', 'Mid-Band', 'High-Band', 'Nyquist (π)'];
            const idx = Math.round(ratio * 4);
            return (
              <g key={ratio}>
                <line
                  x1={x}
                  y1={padding.top + graphHeight}
                  x2={x}
                  y2={padding.top + graphHeight + 5}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
                <text
                  x={x}
                  y={padding.top + graphHeight + 18}
                  textAnchor="middle"
                  className="fill-white font-mono text-[10px] font-black"
                >
                  {labels[idx]}
                </text>
              </g>
            );
          })}

          {/* High Frequency Shelf Zone */}
          <rect
            x={padding.left + graphWidth * 0.65}
            y={padding.top}
            width={graphWidth * 0.35}
            height={graphHeight}
            fill={isFake ? 'rgba(255, 46, 99, 0.22)' : 'rgba(0, 245, 160, 0.12)'}
            stroke={isFake ? '#FF2E63' : '#00F5A0'}
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          <text
            x={padding.left + graphWidth * 0.82}
            y={padding.top + 14}
            textAnchor="middle"
            className={`font-mono text-[10px] uppercase tracking-wider font-black ${
              isFake ? 'fill-[#FF2E63]' : 'fill-[#00F5A0]'
            }`}
          >
            {isFake ? '⚠ Nyquist Noise Shelf' : 'Natural Roll-off'}
          </text>

          {/* Reference Curve */}
          <path
            d={naturalPath}
            fill="none"
            stroke="#CBD5E1"
            strokeWidth="2"
            strokeDasharray="4 4"
          />

          {/* Shaded Area */}
          <path
            d={areaPath}
            fill={isFake ? 'url(#areaGradientFakeBrutal)' : 'url(#areaGradientRealBrutal)'}
          />

          {/* Main Line */}
          <path
            d={profilePath}
            fill="none"
            stroke={isFake ? '#FF2E63' : '#00F5A0'}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Hover Crosshair */}
          {hoverIndex !== null && (
            <g>
              <line
                x1={getX(hoverIndex)}
                y1={padding.top}
                x2={getX(hoverIndex)}
                y2={padding.top + graphHeight}
                stroke="#FFE600"
                strokeWidth="2"
                strokeDasharray="2 2"
              />
              <circle
                cx={getX(hoverIndex)}
                cy={getY(profile[hoverIndex])}
                r="6"
                className={isFake ? 'fill-[#FF2E63]' : 'fill-[#00F5A0]'}
                stroke="#FFFFFF"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>

        {/* Hover / Touch Target */}
        <div
          className="absolute inset-0 cursor-crosshair touch-none"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const relX = (e.clientX - rect.left) / rect.width;
            const index = Math.round(relX * (numPoints - 1));
            if (index >= 0 && index < numPoints) {
              setHoverIndex(index);
            }
          }}
          onTouchStart={(e) => {
            if (e.touches && e.touches[0]) {
              const rect = e.currentTarget.getBoundingClientRect();
              const relX = (e.touches[0].clientX - rect.left) / rect.width;
              const index = Math.round(relX * (numPoints - 1));
              if (index >= 0 && index < numPoints) setHoverIndex(index);
            }
          }}
          onTouchMove={(e) => {
            if (e.touches && e.touches[0]) {
              const rect = e.currentTarget.getBoundingClientRect();
              const relX = (e.touches[0].clientX - rect.left) / rect.width;
              const index = Math.round(relX * (numPoints - 1));
              if (index >= 0 && index < numPoints) setHoverIndex(index);
            }
          }}
          onTouchEnd={() => setHoverIndex(null)}
          onMouseLeave={() => setHoverIndex(null)}
        />
      </div>

      {/* Footer */}
      <div className="mt-3.5 pt-3 border-t-2 border-black/10 dark:border-white/20 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-1.5 text-slate-900 dark:text-white font-bold">
          <Info className="w-4 h-4 text-[#B45309] dark:text-[#FFE600] flex-shrink-0" />
          <span>
            {isFake
              ? 'Flattened slope indicates latent diffusion VAE upsampling noise floor.'
              : 'Continuous exponential decay strictly obeys optical camera exposure.'}
          </span>
        </div>
        {hoverIndex !== null && (
          <div className="bg-[#FFE600] text-black font-black px-2.5 py-1 rounded border-2 border-black shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_#FFFFFF]">
            BIN #{hoverIndex}: {(profile[hoverIndex] * 100).toFixed(1)}% Energy
          </div>
        )}
      </div>
    </div>
  );
}
