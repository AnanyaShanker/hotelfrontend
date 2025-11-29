import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 3000,       // 👈 run on port 3000
    strictPort: true, // optional: fail if 3000 is taken
    open: true        // optional: auto-open browser
  }
})
