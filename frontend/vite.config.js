import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    hmr: {
      protocol: "ws",
      host: "192.168.254.103",
      port: 5176,
    },
  },
})
