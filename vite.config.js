import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['logo.svg', 'favicon.svg'],
      manifest: {
        name: 'Mission Control',
        short_name: 'MissionCtrl',
        description: 'Space Mission Design Game - NASA Space Apps Challenge',
        theme_color: '#0a0e1a',
        background_color: '#0a0e1a',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: 'logo.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'any' },
          { src: 'logo.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any' },
          { src: 'logo.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' }
        ]
      }
    })
  ],
})
