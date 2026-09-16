import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  // server: {
  //   host: true,
  //   port: 5175,
  //   strictPort: true,
  //   open: true,
  // },

  build: {
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': [
            'react',
            'react-dom',
          ],
          'vendor-icons': [
            'lucide-react',
          ],
        },
      },
    },
  },
})