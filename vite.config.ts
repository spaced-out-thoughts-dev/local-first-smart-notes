// vite.config.ts
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import wasm from "vite-plugin-wasm"

export default defineConfig({
  base: "/smart-local-notes/",
  build: {
    target: "esnext",
  },
  plugins: [wasm(), react()],
  worker: {
    format: "es",
    plugins: () => [wasm()],
  },
})
