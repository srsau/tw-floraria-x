import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import commonjs from 'vite-plugin-commonjs';

export default defineConfig({
  plugins: [react(), commonjs()],
  server: {
    port: 5173, // Default Vite port
  },
  resolve: {
    alias: {
      '#core': path.resolve(__dirname, '../module_proprii/'),
    },
  },
});
