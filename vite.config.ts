import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['quiet-notes.svg'],
      manifest: {
        name: 'Quiet Notes',
        short_name: 'Notes',
        description: 'A calm, fast place for thoughts that follow you everywhere.',
        theme_color: '#f6f5f2',
        background_color: '#f6f5f2',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/quiet-notes.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' },
        ],
      },
    }),
  ],
})
