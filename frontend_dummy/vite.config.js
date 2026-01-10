import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000, // Keeps your frontend on port 3000 (optional, you can change to 5173 if you want)
    // Proxy removed entirely — we're using direct API URLs via environment variables now
  },
})