import React, { useState, useEffect } from 'react';
import { Key, Sparkles, Shield, ExternalLink, Check, Zap, Eye, X } from 'lucide-react';

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Check if the user has already seen this first-time welcome popup
    const hasSeenWelcome = localStorage.getItem('the_eyes_welcome_seen');
    if (!hasSeenWelcome) {
      // Trigger after a short delay for smooth page load
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('the_eyes_welcome_seen', 'true');
    setIsOpen(false);
  };

  const handleSaveAndDismiss = () => {
    if (apiKey.trim()) {
      localStorage.setItem('the_eyes_nvidia_key', apiKey.trim());
      setSaved(true);
      setTimeout(() => {
        localStorage.setItem('the_eyes_welcome_seen', 'true');
        setIsOpen(false);
      }, 1000);
    } else {
      handleDismiss();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="glass-brutal-card rounded-2xl p-5 sm:p-7 max-w-lg w-full border-3 border-black dark:border-white bg-white dark:bg-[#12121B] shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_#FFE600] relative overflow-hidden">
        {/* Accent Glow Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#FFE600]" />

        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-black/10 dark:border-white/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FFE600] border-2 border-black flex items-center justify-center text-black font-black shadow-[2px_2px_0px_#000000]">
              <Eye className="w-4 h-4 stroke-[3]" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-[#00F0FF] text-black border border-black shadow-[1px_1px_0px_#000000]">
                QUICK TIP
              </span>
              <h3 className="font-mono font-black text-black dark:text-white text-sm sm:text-base uppercase tracking-tight mt-0.5">
                Connect Your Own API Key
              </h3>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-black border-2 border-black dark:border-white flex items-center justify-center text-black dark:text-white hover:bg-[#FF2E63] hover:text-white transition-colors cursor-pointer"
            title="Close popup"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Informational Body */}
        <div className="space-y-3.5 font-mono text-xs text-slate-800 dark:text-slate-100">
          <p className="leading-relaxed font-bold text-slate-900 dark:text-white">
            <strong className="text-black dark:text-[#FFE600]">The Eyes</strong> comes with a free cloud backend by default. If you want <strong className="underline decoration-2 text-black dark:text-[#00F5A0]">100% serverless, zero-wait, direct browser inference</strong>, you can optionally connect your own personal <strong>NVIDIA NIM API Key</strong>!
          </p>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/60 border-2 border-black/15 dark:border-white/20 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-black text-black dark:text-[#FFE600] flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-[#B45309] dark:text-[#FFE600]" />
                NVIDIA NIM API Key (Optional)
              </span>
              <a
                href="https://build.nvidia.com/google/diffusiongemma-26b-a4b-it"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-blue-600 dark:text-[#00F0FF] font-black hover:underline flex items-center gap-0.5"
              >
                <span>Get Free Key</span>
                <ExternalLink className="w-2.5 h-2.5 stroke-[2.5]" />
              </a>
            </div>

            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="nvapi-..."
              className="w-full p-2.5 rounded-lg border-2 border-black dark:border-white bg-white dark:bg-[#181824] text-black dark:text-white font-mono font-bold text-xs focus:outline-none focus:ring-2 focus:ring-[#FFE600]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-bold text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="text-[#059669] dark:text-[#00F5A0] font-black">✓</span>
              <span>Stored locally on your device only</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#059669] dark:text-[#00F5A0] font-black">✓</span>
              <span>Zero-cold-start direct analysis</span>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="mt-5 pt-3 border-t-2 border-black/10 dark:border-white/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <button
            onClick={handleSaveAndDismiss}
            className="btn-brutal-yellow px-4 py-2.5 rounded-lg text-xs font-mono font-black flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_#000000]"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 text-black stroke-[3]" />
                <span>KEY SAVED!</span>
              </>
            ) : apiKey.trim() ? (
              <>
                <Key className="w-4 h-4 text-black stroke-[2.5]" />
                <span>SAVE &amp; START</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-black stroke-[2.5]" />
                <span>LET'S GET STARTED</span>
              </>
            )}
          </button>

          <button
            onClick={handleDismiss}
            className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-[#181824] border-2 border-black dark:border-white text-black dark:text-white hover:bg-slate-200 dark:hover:bg-black font-mono font-black text-[11px] cursor-pointer"
          >
            I'll use default cloud server
          </button>
        </div>

        <p className="text-[10px] text-center font-mono text-slate-500 dark:text-slate-400 mt-3">
          This reminder will not be shown again. You can change your key anytime via the <strong>NIM KEY</strong> button in the header.
        </p>
      </div>
    </div>
  );
}
