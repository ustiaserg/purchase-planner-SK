import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite generuje produkčný build do priečinka `dist/`.
// V Azure Static Web Apps workflow preto musí byť output_location: "dist".
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    // Aplikácia je jeden veľký súbor — potlačíme varovanie o veľkosti chunku.
    chunkSizeWarningLimit: 1500,
  },
});
