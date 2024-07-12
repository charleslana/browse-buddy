import electron from 'vite-plugin-electron';
import path from 'path';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [
    vue(),
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
              'winston',
              'zod',
            ],
            plugins: [
              {
                name: 'alias',
                resolveId(source) {
                  const resolvedPath = source.endsWith('.ts') ? source : `${source}.ts`;
                  if (source === '@') {
                    return path.resolve(__dirname, 'src', resolvedPath);
                  } else if (source.startsWith('@electron/translate')) {
                    return path.resolve(
                      __dirname,
                      'electron',
                      source.replace('@electron/', '') + '/index.ts'
                    );
                  } else if (source.startsWith('@electron')) {
                    return path.resolve(
                      __dirname,
                      'electron',
                      resolvedPath.replace('@electron/', '')
                    );
                  } else if (source.startsWith('@puppeteer')) {
                    return path.resolve(
                      __dirname,
                      'puppeteer',
                      resolvedPath.replace('@puppeteer/', '')
                    );
                  }
                  return null;
                },
              },
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
