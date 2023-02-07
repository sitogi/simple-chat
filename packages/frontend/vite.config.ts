import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
// noinspection JSUnusedGlobalSymbols
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '~/': `${__dirname}/src/`, // path.join(__dirname, "src/") でも可
    },
  },
});
