import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';
import { checker } from 'vite-plugin-checker';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    nodePolyfills(),
    svgr(),
    checker({
      typescript: true, 
    }),
  ],
  base: '/',
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
