// Capture install availability before React mounts, including slow first visits.
const displayMode = window.matchMedia('(display-mode: standalone)');
let pendingPrompt = null;
let state = { canInstall: false, installed: displayMode.matches || navigator.standalone === true };
const listeners = new Set();
const publish = (changes) => {
  state = { ...state, ...changes };
  listeners.forEach(listener => listener());
};
const beforeInstall = (event) => {
  event.preventDefault();
  pendingPrompt = event;
  publish({ canInstall: true, installed: false });
};
const installed = () => {
  pendingPrompt = null;
  publish({ canInstall: false, installed: true });
};
const modeChanged = () => {
  if (displayMode.matches) installed();
};
window.addEventListener('beforeinstallprompt', beforeInstall);
window.addEventListener('appinstalled', installed);
displayMode.addEventListener('change', modeChanged);

export const getInstallState = () => state;
export const subscribeToInstall = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
export async function requestInstall() {
  if (!pendingPrompt) return 'unavailable';
  const event = pendingPrompt;
  pendingPrompt = null;
  publish({ canInstall: false });
  await event.prompt(); // Must run directly from a user gesture.
  return (await event.userChoice).outcome;
}

if (import.meta.hot) import.meta.hot.dispose(() => {
  window.removeEventListener('beforeinstallprompt', beforeInstall);
  window.removeEventListener('appinstalled', installed);
  displayMode.removeEventListener('change', modeChanged);
});
