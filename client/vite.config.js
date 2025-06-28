import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// Minimal Vite config without CSS processing
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  server: {
    port: 5173,
  },
  build: {
    target: "es2020",
    chunkSizeWarningLimit: 1000,
  },
  define: {
    "process.env.VITE_BACKEND_URL": JSON.stringify(
      process.env.VITE_BACKEND_URL || "http://localhost:6900"
    ),
    global: "globalThis",
  },
});
