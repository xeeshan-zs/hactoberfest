import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Download, X, Share2, WifiOff } from 'lucide-react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { getInstallState, subscribeToInstall, requestInstall } from '../pwaInstall';

const SEEN_KEY = 'the_eyes_install_prompt_seen_v1';
function alreadySeen() {
  try { return localStorage.getItem(SEEN_KEY) === 'true'; } catch { return false; }
}

export default function InstallPrompt() {
  const { canInstall, installed } = useSyncExternalStore(subscribeToInstall, getInstallState);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [online, setOnline] = useState(navigator.onLine);
  const dialog = useRef(null);
  const launcher = useRef(null);
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const { needRefresh: [needRefresh, setNeedRefresh], updateServiceWorker } = useRegisterSW();

  useEffect(() => {
    if (installed || alreadySeen()) return;
    const timer = setTimeout(() => setOpen(true), 900);
    return () => clearTimeout(timer);
  }, [installed]);

  useEffect(() => {
    if (open && !installed) {
      if (!dialog.current.open) dialog.current.showModal();
    } else if (dialog.current.open) { dialog.current.close(); launcher.current?.focus(); }
  }, [open, installed]);

  useEffect(() => {
    const changed = () => setOnline(navigator.onLine);
    window.addEventListener('online', changed);
    window.addEventListener('offline', changed);
    return () => { window.removeEventListener('online', changed); window.removeEventListener('offline', changed); };
  }, []);

  function dismiss() {
    try { localStorage.setItem(SEEN_KEY, 'true'); } catch { /* Storage may be unavailable. */ }
    setOpen(false);
  }
  async function install() {
    setBusy(true); setError('');
    try {
      const outcome = await requestInstall();
      if (outcome === 'accepted' || outcome === 'dismissed') dismiss();
    } catch {
      setError('The browser could not open installation. Use its menu to install, or try again later.');
    } finally { setBusy(false); }
  }

  return <>
    {!installed && <button hidden={open} ref={launcher} onClick={() => { setError(''); setOpen(true); }}
      className="pwa-launcher" aria-label="Install The Eyes"><Download className="w-4 h-4" /><span>Install app</span></button>}
    <dialog ref={dialog} className="pwa-dialog" aria-labelledby="pwa-title" aria-describedby="pwa-description"
      onCancel={event => { event.preventDefault(); dismiss(); }} onClick={event => { if (event.target === dialog.current) dismiss(); }}>
      <div className="relative p-6 sm:p-8">
        <button onClick={dismiss} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10" aria-label="Close install prompt"><X className="w-4 h-4" /></button>
        <img src="/icons/icon-192.png" alt="" width="64" height="64" className="rounded-2xl mb-5 border border-black/10" />
        <span className="text-[10px] font-mono font-bold uppercase tracking-[.16em] text-slate-500 dark:text-slate-400">Your image inspection workspace</span>
        <h2 id="pwa-title" className="text-2xl sm:text-3xl font-black tracking-tight mt-2">Keep The Eyes<br />one tap away.</h2>
        <p id="pwa-description" className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-4">Add The Eyes to your home screen or desktop and open it in its own app window.</p>
        {!canInstall && <div className="mt-5 p-4 rounded-xl bg-slate-100 dark:bg-white/5 text-sm leading-relaxed" role="note">
          <p className="font-bold mb-1 flex items-center gap-2"><Share2 className="w-4 h-4" />{ios ? 'Install from Safari' : 'Install from your browser'}</p>
          <p>{ios ? 'Open this page in Safari, tap Share, then Add to Home Screen and Add.' : 'In Chrome or Edge, open the browser menu and look for “Install The Eyes” or “Apps → Install this site as an app”. If it is unavailable, try opening this page directly in Chrome or Edge.'}</p>
        </div>}
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 leading-relaxed">The app interface can open offline after your first online visit. Image analysis still needs an internet connection.</p>
        {error && <p role="alert" className="text-sm text-red-600 dark:text-red-400 mt-3">{error}</p>}
        <div className="flex gap-3 mt-6">
          {canInstall && <button onClick={install} disabled={busy} className="btn-brutal-yellow rounded-lg px-4 py-3 text-sm flex-1 flex items-center justify-center gap-2"><Download className="w-4 h-4" />{busy ? 'Opening installation…' : 'Install app'}</button>}
          <button autoFocus onClick={dismiss} className="btn-brutal-dark rounded-lg px-4 py-3 text-sm flex-1">{canInstall ? 'Maybe later' : 'Continue in browser'}</button>
        </div>
      </div>
    </dialog>
    {!online && <div className="pwa-notice" role="status"><WifiOff className="w-4 h-4 shrink-0" />You’re offline. Connect to analyze images.</div>}
    {needRefresh && <div className="pwa-notice" role="status">
      <span>A new version is ready. Reloading clears your current image.</span>
      <button className="font-bold underline shrink-0" onClick={() => updateServiceWorker(true)}>Update</button>
      <button aria-label="Dismiss app update" onClick={() => setNeedRefresh(false)}><X className="w-4 h-4" /></button>
    </div>}
  </>;
}
