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
        name: 'Wedding Archive',
        short_name: 'Wedding Archive',
        description: 'Capture and share photos from the wedding',
        theme_color: '#7e14ff',
        background_color: '#ffffff',
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
        ],
      },
    }),
  ],
})
