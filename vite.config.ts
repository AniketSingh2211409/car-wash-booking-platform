import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // ✅ Tailwind plugin import kiya
import path from 'path'

export default defineConfig({
  base: "/", // ✅ ye sahi hai (Netlify ke liye)

  plugins: [
    react(),
    tailwindcss(), // ✅ Tailwind plugin yahan add kiya
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    port: 3000,
    host: '0.0.0.0',
  },
})