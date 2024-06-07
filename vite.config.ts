import electron from 'vite-plugin-electron';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
// import electron from 'vite-plugin-electron/simple';
// import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [
    vue(),
    // electron({
    //   main: {
    //     entry: 'electron/main.ts',
    //   },
    //   preload: {
    //     input: path.join(__dirname, 'electron/preload.ts'),
    //   },
    //   renderer: process.env.NODE_ENV === 'test' ? undefined : {},
    // }),
    electron({
      entry: ['electron/main.ts', 'electron/preload.ts'],
      vite: {
        build: {
          emptyOutDir: true,
          rollupOptions: {
            external: [
              '@fortawesome/fontawesome-svg-core',
              '@fortawesome/free-brands-svg-icons',
              '@fortawesome/free-regular-svg-icons',
              '@fortawesome/free-solid-svg-icons',
              '@fortawesome/vue-fontawesome',
              'bulma',
              'electron-store',
              'electron-updater',
              'floating-vue',
              'puppeteer',
              'vue-draggable-next',
              'vue-i18n',
              'vue-loading-overlay',
              'winston',
              'zod',
            ],
          },
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@electron': fileURLToPath(new URL('./electron', import.meta.url)),
      '@puppeteer': fileURLToPath(new URL('./puppeteer', import.meta.url)),
    },
  },
  build: {
    emptyOutDir: true,
  },
});
