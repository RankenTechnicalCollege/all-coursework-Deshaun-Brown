import { defineConfig } from "vite"
import path from "path"
import react from "@vitejs/plugin-react"

import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
   optimizeDeps: {
    exclude: ["betterauth"]
  },

   esbuild: {
    tsconfigRaw: {}
  },
  
  
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  ssr: {
    noExternal: ['@rollup/wasm-node']
  },
   server: {
    host: true,
    port: 8080,
    watch: {
      usePolling: true,
      interval:1000,
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'radix-vendor': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-context-menu',
            '@radix-ui/react-dialog',
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-slot'
          ],
          'utils-vendor': ['axios', 'zod', 'moment'],
          'toast-vendor': ['react-toastify'],
        },
      },
    },
  },
})