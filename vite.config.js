import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import { resolveApiBaseUrl } from './src/api/config.js';

export default defineConfig(({ command, mode }) => {
  if (command === 'build') resolveApiBaseUrl({ ...loadEnv(mode, process.cwd(), 'VITE_'), PROD: true });
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  };
});
