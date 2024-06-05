import electron from 'vite-plugin-electron/simple';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [
    vue(),
    electron({
      main: {
        entry: 'electron/main.ts',
      },
      preload: {
        input: path.join(__dirname, 'electron/preload.ts'),
      },
      renderer: process.env.NODE_ENV === 'test' ? undefined : {},
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@electron': fileURLToPath(new URL('./electron', import.meta.url)),
    },
  },
  build: {
    emptyOutDir: true,
  },
});
