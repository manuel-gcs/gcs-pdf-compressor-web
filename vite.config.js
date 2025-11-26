import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic" // força React runtime moderno no Vercel
    }),
  ],

  worker: {
    // Corrige erro do Vercel com Web Workers
    format: "es"
  },

  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        // workers NÃO podem usar iife ou umd no Vercel
        format: "es"
      }
    }
  }
});