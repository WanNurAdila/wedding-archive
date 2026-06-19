import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/favicon-32.png'],
      manifest: {
        name: 'Alia & Ariff — Wedding',
        short_name: 'Alia & Ariff',
        description: 'Wedding details, wishes, and gallery for Alia & Ariff.',
        theme_color: '#fbf6ec',
        background_color: '#fbf6ec',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icons/pwa-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icons/pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /\/api\/photos$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'wedding-photos-list',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 },
            },
          },
          {
            urlPattern: /\/api\/photos\/[^/]+$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'wedding-photos',
              expiration: { maxEntries: 200 },
            },
          },
          {
            urlPattern: /\/api\/wishes$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'wedding-wishes',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 },
            },
          },
        ],
      },
    }),
  ],
})
