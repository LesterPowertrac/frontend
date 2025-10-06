import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/frontend/",
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    port: 3001, // Set the port to 3001
  },
})
