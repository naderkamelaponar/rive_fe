import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
import ssr from '@vitejs/plugin-ssr';


export default defineConfig({
  plugins: [react(),wasm(),ssr()],
  server: {
    mimeTypes: {
      'application/wasm': ['wasm']
    }
  },
  base: './', // Ensure the base path is correct
});

