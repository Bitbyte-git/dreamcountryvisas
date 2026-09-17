import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Hostinger's shared-hosting security layer blocks requests to "/assets/*"
    // account-wide (a WordPress-attack-path rule) — rename the output dir to dodge it.
    assetsDir: 'static-files',
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
