import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';



export default defineConfig({
  plugins: [react(),wasm()],
  server: {
    mimeTypes: {
      'application/wasm': ['wasm']
    }
  },
  base: './', // Ensure the base path is correct
});

