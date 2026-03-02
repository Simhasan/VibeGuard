import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
   server: {
    watch: {
      ignored: [
        '**/reports/**',
        '**/sessions.json',
        '**/venv/**',
        '**/__pycache__/**',
        '**/agents/**',
        '**/core/**',
        '**/utils/**',
        '**/web_api/**',
        '**/config/**',
      ]
    }
  }
})



