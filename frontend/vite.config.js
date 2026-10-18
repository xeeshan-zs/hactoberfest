import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'prompt',
    includeAssets: ['icons/*.png', 'icons/eye.svg'],
    manifest: {
      id: '/',
      name: 'The Eyes — Image Inspection',
      short_name: 'The Eyes',
      description: 'Inspect image patterns and compare AI visual analysis.',
      start_url: '/',
      scope: '/',
      display: 'standalone',
      theme_color: '#FFE600',
      background_color: '#F4F4F0',
      lang: 'en',
      icons: [
        { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,webmanifest}'],
      navigateFallback: '/index.html',
      navigateFallbackDenylist: [/^\/(?:api|predict|health|docs)(?:\/|$)/],
      cleanupOutdatedCaches: true,
      // Only precache the app shell. Uploads, API answers and credentials stay network-only.
      runtimeCaching: [],
    },
    devOptions: { enabled: false },
  })],
  server: {
    port: 5173,
    host: true,
  },
});
