import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0',  // Listen on all network interfaces (localhost + LAN IP)
    hmr: {
      host: '10.199.109.93',
      port: 5173,
      protocol: 'http'
    }
  }
})
