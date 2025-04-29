import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-worker',
      closeBundle() {
        // Copy worker.js to dist folder
        const workerSrc = path.resolve(__dirname, 'src/worker.js');
        const workerDest = path.resolve(__dirname, 'dist/worker.js');
        const distDir = path.dirname(workerDest);

        try {
          // Ensure dist directory exists
          if (!fs.existsSync(distDir)) {
            fs.mkdirSync(distDir, { recursive: true });
          }

          // Only try to copy if source exists
          if (fs.existsSync(workerSrc)) {
            fs.copyFileSync(workerSrc, workerDest);
            console.log('✓ Worker script copied to dist folder');
          } else {
            console.log('No worker script found, skipping copy');
          }
        } catch (error) {
          console.warn('Warning: Could not copy worker script:', error.message);
        }
      }
    }
  ],
})
