import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic",
      babel: {
        plugins: [
          // Necessário para garantir import automático de React na Vercel
          "@babel/plugin-transform-react-jsx",
          "@babel/plugin-transform-react-jsx-self",
          "@babel/plugin-transform-react-jsx-source"
        ]
      }
    })
  ],
  build: {
    target: "esnext",
    sourcemap: false,
    rollupOptions: {
      output: {
        format: "es"
      }
    }
  },
  worker: {
    format: "es"
  }
});