import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Minimal Vite config without CSS processing
export default defineConfig({
  plugins: [react()],
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
  },
  define: {
    "process.env.VITE_BACKEND_URL": JSON.stringify(
      process.env.VITE_BACKEND_URL || "http://localhost:1000"
    ),
  },
  css: {
    postcss: false,
  },
});
