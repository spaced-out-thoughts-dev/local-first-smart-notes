// vite.config.ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import electron from 'vite-plugin-electron';
import wasm from "vite-plugin-wasm";
import { resolve } from 'path';

export default defineConfig({
  base: "./",
  build: {
    target: "esnext",
    outDir: 'dist',
  },
  plugins: [
    wasm(), 
    react(),
    electron({
      entry: resolve(__dirname, 'electron/main.js'),
      vite: {
        build: {
          outDir: 'dist-electron',
        }
      }
    })
  ],
  worker: {
    format: "es",
    plugins: () => [wasm()],
  },
});
