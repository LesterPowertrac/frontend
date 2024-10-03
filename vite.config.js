import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/frontend/",
  plugins: [react()],
  server: {
    port: 3001, // Set the port to 3001
  },
})
