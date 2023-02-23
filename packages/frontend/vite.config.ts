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
      '/auth/': 'http://localhost:3000',
      '/profile': 'http://localhost:3000',
    },
  },
});
