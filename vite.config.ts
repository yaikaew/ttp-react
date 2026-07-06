import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // เปิดให้ access จาก network
    port: 5173
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'react-vendor'
            }
            if (id.includes('@supabase')) {
              return 'supabase'
            }
            if (id.includes('@tanstack')) {
              return 'query'
            }
            if (id.includes('@fortawesome')) {
              return 'fontawesome'
            }
            if (id.includes('lucide-react')) {
              return 'icons'
            }
          }
        }
      }
    }
  }
})
