import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        format: "es" // 🔥 IMPORTANTE: workers só funcionam como ES modules
      }
    }
  },
  worker: {
    format: "es" // 🔥 corrige o erro no Vercel
  }
});