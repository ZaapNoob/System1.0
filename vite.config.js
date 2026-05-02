import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig(({ command, mode }) => {
  // Load .env variables (VITE_SERVER_HOST is the only one needed here)
  const env = loadEnv(mode, process.cwd(), '')
  const SERVER_HOST = env.VITE_SERVER_HOST || 'localhost'

  return {
    plugins: [react()],
    server: {
      host: "0.0.0.0",
      port: 5173,
      strictPort: true,
      // HMR (Hot Module Reload) setup
      // IMPORTANT: When using HTTPS through Apache proxy, HMR has security constraints
      // Page is HTTPS, so WebSocket must be WSS (secure)
      // But Vite HMR only supports WS on port 5173
      // Solution: Use polling instead of WebSocket for HTTPS access
      hmr: SERVER_HOST === 'localhost' 
        ? {
            protocol: 'ws',
            host: 'localhost',
            port: 5173,
          }
        : {
            // For HTTPS access, use polling (less responsive but works)
            protocol: 'http',
            host: SERVER_HOST,
            port: 5173,
          },
      // Proxy API requests to the PHP backend on Apache
      proxy: {
        '/api': {
          target: `http://${SERVER_HOST}:80`,
          changeOrigin: true,
          rewrite: (path) => path,
        },
        '/ws': {
          target: 'ws://127.0.0.1:8080',
          ws: true,
          changeOrigin: true,
        }
      }
    }
  }
})