import React, { useState } from 'react';
import { Eye, Cpu, Sparkles, Github, RefreshCw, Sun, Moon, Info, Key, Check } from 'lucide-react';

export default function Header({ 
  backendHealth, 
  onReset, 
  hasResult, 
  theme, 
  onToggleTheme,
  currentView,
  onNavigate
}) {
  const isOnline = backendHealth?.status === 'online';
  const modelName = backendHealth?.model_file || 'ExtraTrees Multi-Spectral';

  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(() => {
    return localStorage.getItem('the_eyes_nvidia_key') || '';
  });
  const [keySaved, setKeySaved] = useState(false);

  const handleSaveKey = () => {
    localStorage.setItem('the_eyes_nvidia_key', apiKeyInput.trim());
    setKeySaved(true);
    setTimeout(() => {
      setKeySaved(false);
      setShowKeyModal(false);
    }, 1200);
  };

  return (
    <>
      <header className="border-b-2 border-black dark:border-white bg-[#FFFFFF]/95 dark:bg-[#050508]/95 backdrop-blur-xl sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 min-h-[3.75rem] py-2 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Block */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div
              onClick={() => onNavigate('detector')}
              className="cursor-pointer px-2.5 sm:px-3.5 py-1.5 rounded-lg bg-[#FFE600] border-2 border-black shadow-[2px_2px_0px_#000000] sm:shadow-[3px_3px_0px_#000000] dark:shadow-[2px_2px_0px_#FFFFFF] font-mono font-black text-black text-xs sm:text-sm tracking-wider flex items-center gap-1.5 sm:gap-2 hover:translate-x-[-1px] hover:translate-y-[-1px] transition-transform select-none"
            >
              <Eye className="w-4 h-4 stroke-[3]" />
              <span>THE EYES</span>
              <span className="text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.2 bg-black text-[#FFE600] font-black rounded">2.0</span>
              {/* Mobile Online Dot */}
              <span className={`sm:hidden w-2 h-2 rounded-full border border-black ${isOnline ? 'bg-[#00F5A0]' : 'bg-[#FF2E63]'}`} title={isOnline ? 'Backend Online' : 'Direct NIM'} />
            </div>

            <span className="hidden lg:inline-block text-xs font-mono text-black dark:text-white font-black border-l-2 border-black/30 dark:border-white/40 pl-3">
              2D FOURIER SPECTRAL FORENSICS
            </span>
          </div>

          {/* Center / Right Navigation Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 text-xs font-mono">
            {/* Navigation View Toggle */}
            <button
              onClick={() => onNavigate(currentView === 'about' ? 'detector' : 'about')}
              className={`px-2 sm:px-3 py-1.5 rounded-md border-2 border-black font-mono font-black flex items-center gap-1 sm:gap-1.5 transition-all shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_#FFFFFF] ${
                currentView === 'about'
                  ? 'bg-[#00F0FF] text-black'
                  : 'bg-white dark:bg-[#181824] text-black dark:text-white hover:bg-[#FFE600] hover:text-black'
              }`}
              title="Project Dossier & About"
            >
              <Info className="w-3.5 h-3.5 stroke-[3]" />
              <span className="hidden xs:inline sm:inline">{currentView === 'about' ? 'DETECTOR' : 'ABOUT'}</span>
            </button>

            {/* Direct NIM API Key Config */}
            <button
              onClick={() => setShowKeyModal(true)}
              className="px-2 sm:px-2.5 py-1.5 rounded-md bg-white dark:bg-[#181824] border-2 border-black dark:border-white text-black dark:text-white font-black hover:bg-[#FFE600] hover:text-black shadow-[2px_2px_0px_#000000] flex items-center gap-1 sm:gap-1.5"
              title="Configure Browser-Direct NVIDIA NIM Key"
            >
              <Key className="w-3.5 h-3.5 text-[#B45309] dark:text-[#FFE600]" />
              <span className="hidden md:inline">NIM KEY</span>
            </button>

            {/* Server Status Pill (Tablet/Desktop) */}
            <div className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-md border-2 border-black shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_#FFFFFF] font-black ${
              isOnline
                ? 'bg-[#00F5A0] text-black'
                : 'bg-[#FF2E63] text-white'
            }`}>
              <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-black' : 'bg-white'} animate-pulse`} />
              <span>{isOnline ? 'BACKEND: ONLINE' : 'DIRECT NIM'}</span>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-md bg-[#FFE600] text-black border-2 border-black shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_#FFFFFF] font-mono font-black flex items-center gap-1 sm:gap-1.5 hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all cursor-pointer"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 stroke-[3] text-black" />
                  <span className="hidden sm:inline">LIGHT</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 stroke-[3] text-black" />
                  <span className="hidden sm:inline">DARK</span>
                </>
              )}
            </button>

            {/* GitHub Repo Link */}
            <a
              href="https://github.com/xeeshan-zs/The-Eyes"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-md bg-white dark:bg-[#181824] border-2 border-black dark:border-white shadow-[2px_2px_0px_#000000] text-black dark:text-white hover:bg-[#FFE600] hover:text-black hover:border-black transition-all"
              title="GitHub Repository"
            >
              <Github className="w-3.5 sm:w-4 h-3.5 sm:h-4 stroke-[2.5]" />
            </a>

            {/* Reset Button */}
            {hasResult && currentView === 'detector' && (
              <button
                onClick={onReset}
                className="btn-brutal-yellow px-2 sm:px-3 py-1 rounded-md text-xs font-mono font-black flex items-center gap-1 sm:gap-1.5"
                title="Analyze Another Image"
              >
                <RefreshCw className="w-3.5 h-3.5 stroke-[3]" />
                <span className="hidden sm:inline">NEW IMAGE</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Browser Direct NIM Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="glass-brutal-card rounded-xl p-5 sm:p-6 max-w-md w-full border-2 border-black dark:border-white bg-white dark:bg-[#14141E] shadow-[8px_8px_0px_#000000]">
            <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-black/10 dark:border-white/20">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-[#B45309] dark:text-[#FFE600]" />
                <h3 className="font-mono font-black text-black dark:text-white text-xs sm:text-sm uppercase">
                  Browser-Direct NVIDIA NIM Key
                </h3>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="font-mono font-black text-xs bg-slate-200 dark:bg-black px-2.5 py-1 rounded border border-black dark:border-white text-black dark:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-[11px] sm:text-xs font-mono text-slate-800 dark:text-slate-200 mb-4 font-bold leading-relaxed">
              Enables **100% Serverless Direct Browser Inference**. Stored locally only in your browser storage.
            </p>

            <div className="space-y-3 font-mono text-xs">
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="nvapi-..."
                className="w-full p-2.5 sm:p-3 rounded-lg border-2 border-black dark:border-white bg-slate-50 dark:bg-black text-black dark:text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#FFE600]"
              />

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleSaveKey}
                  className="btn-brutal-yellow px-3 sm:px-4 py-2 rounded-lg font-black flex items-center gap-2 cursor-pointer text-xs"
                >
                  {keySaved ? <Check className="w-4 h-4 text-black stroke-[3]" /> : <Key className="w-4 h-4 text-black" />}
                  <span>{keySaved ? 'KEY SAVED!' : 'SAVE LOCAL KEY'}</span>
                </button>

                <button
                  onClick={() => {
                    localStorage.removeItem('the_eyes_nvidia_key');
                    setApiKeyInput('');
                  }}
                  className="text-[11px] text-red-500 font-bold hover:underline cursor-pointer"
                >
                  Clear Key
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
