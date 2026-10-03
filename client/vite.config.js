import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Proxy /api và /socket.io sang backend để cookie JWT hoạt động cùng origin khi dev.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000',
      '/socket.io': { target: 'http://localhost:5000', ws: true },
    },
  },
});
