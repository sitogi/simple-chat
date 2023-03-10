import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
// noinspection JSUnusedGlobalSymbols
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '~/': `${__dirname}/src/`, // path.join(__dirname, "src/") でも可
    },
  },
  server: {
    proxy: {
      '/api/': 'http://localhost:3000',
    },
  },
});
