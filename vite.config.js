import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    // Apache handles HTTPS termination on 443
    // Vite runs plain HTTP on 5173 internally
    // HMR connects through Apache proxy → wss://192.168.1.42/
    hmr: {
      protocol: "wss",
      host: "192.168.1.45",
      // IMPORTANT: Don't specify port here - it defaults to 443 for wss
      // Vite doesn't bind to this address, it just tells the client where to connect
      // Apache will proxy it through
    }
  }
})