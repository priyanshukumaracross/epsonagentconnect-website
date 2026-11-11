import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

// In dev, /api and /socket.io are proxied to the backend, so the app is same-origin.
// Served over HTTPS (self-signed) so phones on your Wi-Fi can use camera/mic.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const target = env.VITE_PROXY_TARGET || 'http://localhost:4000';
  // HTTPS by default: browsers only allow camera/mic on https (or localhost). Use `npm run dev:http` to turn it off.
  const useHttps = process.env.HTTP !== 'true';
  return {
    plugins: [react(), ...(useHttps ? [basicSsl()] : [])],
    server: {
      port: 5173,
      host: true,
      proxy: {
        '/api': { target, changeOrigin: true },
        '/socket.io': { target, ws: true, changeOrigin: true },
      },
    },
    preview: { port: 4173 },
  };
});
