import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// CodeSandbox serves the dev server from *.csb.app; Vite blocks unknown hosts by default.
const sandboxHosts = ['.csb.app'];

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { host: true, allowedHosts: sandboxHosts },
  preview: { host: true, allowedHosts: sandboxHosts },
  test: {
    environment: 'jsdom',
    setupFiles: ['src/test/setup.ts'],
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/main.tsx', 'src/test/**', 'src/**/*.test.{ts,tsx}'],
    },
  },
});
