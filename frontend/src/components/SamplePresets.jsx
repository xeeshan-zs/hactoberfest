import React from 'react';
import { Camera, Sparkles, Image as ImageIcon, Zap, Bot } from 'lucide-react';

function createSampleCanvasImage(type) {
  const canvas = document.createElement('canvas');
  canvas.width = 384;
  canvas.height = 384;
  const ctx = canvas.getContext('2d');

  if (type === 'real_nature') {
    const grad = ctx.createRadialGradient(192, 192, 10, 192, 192, 220);
    grad.addColorStop(0, '#5C7E6C');
    grad.addColorStop(0.4, '#2F4858');
    grad.addColorStop(1, '#1A2634');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 384, 384);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 25; i++) {
      ctx.beginPath();
      ctx.arc(192 + Math.sin(i * 0.4) * 70, 192 + Math.cos(i * 0.4) * 70, 30 + i * 7, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (type === 'real_dslr') {
    const grad = ctx.createLinearGradient(0, 0, 384, 384);
    grad.addColorStop(0, '#DE9B72');
    grad.addColorStop(0.5, '#723B44');
    grad.addColorStop(1, '#1C1520');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 384, 384);

    ctx.fillStyle = 'rgba(255, 235, 210, 0.4)';
    ctx.beginPath();
    ctx.arc(160, 160, 95, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 'ai_dalle3') {
    ctx.fillStyle = '#0B132B';
    ctx.fillRect(0, 0, 384, 384);

    for (let x = 0; x < 384; x += 12) {
      for (let y = 0; y < 384; y += 12) {
        const val = ((x ^ y) % 20) * 9;
        ctx.fillStyle = `rgb(${val + 50}, ${val + 15}, ${val + 90})`;
        ctx.fillRect(x, y, 6, 6);
      }
    }
    const grad = ctx.createRadialGradient(192, 192, 10, 192, 192, 150);
    grad.addColorStop(0, 'rgba(255, 46, 99, 0.7)');
    grad.addColorStop(1, 'rgba(0, 240, 255, 0.1)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 384, 384);
  } else if (type === 'ai_gemini') {
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, 384, 384);

    ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 384; i += 10) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(384 - i, 384);
      ctx.stroke();
    }
    const grad = ctx.createRadialGradient(192, 192, 10, 192, 192, 130);
    grad.addColorStop(0, 'rgba(176, 102, 255, 0.85)');
    grad.addColorStop(1, 'rgba(255, 46, 99, 0.2)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 384, 384);
  } else if (type === 'ai_midjourney') {
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, 384, 384);

    for (let x = 0; x < 384; x += 8) {
      for (let y = 0; y < 384; y += 8) {
        if ((x + y) % 16 === 0) {
          ctx.fillStyle = 'rgba(255, 100, 150, 0.5)';
          ctx.fillRect(x, y, 4, 4);
        }
      }
    }
  }

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const file = new File([blob], `${type}_demo.png`, { type: 'image/png' });
      resolve(file);
    }, 'image/png');
  });
}

export default function SamplePresets({ onSelectSample, disabled }) {
  const PRESETS = [
    {
      id: 'real_dslr',
      label: 'DSLR RAW Studio',
      provider: 'Canon EOS R5',
      tag: 'REAL',
      isReal: true,
      icon: Camera,
    },
    {
      id: 'real_nature',
      label: 'Natural Landscape',
      provider: 'Optical Exposure',
      tag: 'REAL',
      isReal: true,
      icon: ImageIcon,
    },
    {
      id: 'ai_dalle3',
      label: 'ChatGPT DALL-E 3',
      provider: 'OpenAI LDM',
      tag: 'AI GEN',
      isReal: false,
      icon: Bot,
    },
    {
      id: 'ai_gemini',
      label: 'Gemini Imagen 3',
      provider: 'Google DeepMind',
      tag: 'AI GEN',
      isReal: false,
      icon: Sparkles,
    },
    {
      id: 'ai_midjourney',
      label: 'Midjourney v6',
      provider: 'Diffusion Latent',
      tag: 'AI GEN',
      isReal: false,
      icon: Zap,
    },
  ];

  const handleClick = async (presetId) => {
    if (disabled) return;
    const file = await createSampleCanvasImage(presetId);
    onSelectSample(file);
  };

  return (
    <div className="glass-brutal rounded-xl p-4 sm:p-5 shadow-[6px_6px_0px_#000000]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 mb-3 sm:mb-3.5">
        <div className="flex items-center gap-2">
          <span className="px-2.5 sm:px-3 py-1 rounded bg-[#FFE600] text-black font-mono font-black text-xs border-2 border-black shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_#FFFFFF]">
            BENCHMARKS
          </span>
          <span className="text-xs font-mono font-black text-black dark:text-white uppercase tracking-wide">
            1-Click Benchmark Presets
          </span>
        </div>
        <span className="text-[10px] sm:text-[11px] font-mono font-black text-black dark:text-[#FFE600] self-start sm:self-auto">
          SELECT SAMPLE TO TEST
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
        {PRESETS.map((preset, idx) => {
          const Icon = preset.icon;
          const isLastOdd = idx === PRESETS.length - 1;
          return (
            <button
              key={preset.id}
              onClick={() => handleClick(preset.id)}
              disabled={disabled}
              className={`p-3 sm:p-3.5 rounded-lg border-2 text-left transition-all ${
                isLastOdd ? 'col-span-2 sm:col-span-1' : ''
              } ${
                preset.isReal
                  ? 'bg-[#ECFDF5] dark:bg-[#0A1610] border-black dark:border-[#00F5A0] shadow-[3px_3px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px]'
                  : 'bg-[#FFF1F2] dark:bg-[#180A10] border-black dark:border-[#FF2E63] shadow-[3px_3px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px]'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center justify-between mb-2 sm:mb-2.5">
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${preset.isReal ? 'text-[#059669] dark:text-[#00F5A0]' : 'text-[#E11D48] dark:text-[#FF2E63]'} stroke-[3]`} />
                <span className={`text-[9px] sm:text-[10px] font-mono font-black px-1.5 sm:px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000000] dark:shadow-[1px_1px_0px_#FFFFFF] ${
                  preset.isReal ? 'bg-[#00F5A0] text-black' : 'bg-[#FF2E63] text-white'
                }`}>
                  {preset.tag}
                </span>
              </div>

              <div>
                <span className="text-[11px] sm:text-xs font-black text-black dark:text-white block truncate">
                  {preset.label}
                </span>
                <span className={`text-[9px] sm:text-[10px] font-mono font-bold block truncate mt-0.5 ${
                  preset.isReal ? 'text-[#047857] dark:text-[#A7F3D0]' : 'text-[#BE123C] dark:text-[#FECDD3]'
                }`}>
                  {preset.provider}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
