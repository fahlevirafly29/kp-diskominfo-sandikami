import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  build: {
	modulePreload: false,

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') ||
              id.includes('node_modules/react-dom') ||
              id.includes('node_modules/react-router-dom')) {
            return 'react'
          }

          if (id.includes('node_modules/recharts')) {
            return 'charts'
          }

          if (id.includes('node_modules/lucide-react')) {
            return 'icons'
          }

          if (id.includes('node_modules/html2pdf.js')) {
            return 'pdf'
          }
        },
      },
    },
  },

  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})

