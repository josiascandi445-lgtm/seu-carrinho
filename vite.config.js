import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuração do Vite. O build vai para /dist, que o Capacitor usa como webDir.
export default defineConfig({
  plugins: [react()],
  server: { host: true, port: 5173 },
  build: { chunkSizeWarningLimit: 600 },
});
