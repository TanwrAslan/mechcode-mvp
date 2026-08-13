import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        // Tum uygulama ici importlar `@/...` uzerinden gider; klasor derinligi
        // degistiginde relative yollari duzeltmek gerekmez.
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      // Production build dogrudan FastAPI'nin servis ettigi klasore duser.
      // (bkz. backend/app/config.py -> STATIC_DIR)
      outDir: path.resolve(__dirname, '../backend/static'),
      emptyOutDir: true,
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify — file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
        },
      },
    },
  };
});
