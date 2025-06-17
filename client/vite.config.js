import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
  ],
  server: {
    port: 6900,
    proxy: {
      "^/api/.*": {
        target: process.env.VITE_BACKEND_URL || "http://localhost:1000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "^/loan/.*": {
        target: process.env.VITE_BACKEND_URL || "http://localhost:1000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    target: "es2020",
    rollupOptions: {
      output: {
        format: "es",
      },
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "es2020",
      supported: {
        bigint: true,
      },
    },
  },
  define: {
    "process.env.VITE_BACKEND_URL": JSON.stringify(
      process.env.VITE_BACKEND_URL || "http://localhost:1000"
    ),
  },
});
