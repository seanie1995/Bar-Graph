import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        format: 'iife', // Ensures a single file output (Immediately Invoked Function Expression)
        entryFileNames: 'bundle.js', // Name the bundled file explicitly
        inlineDynamicImports: true, // Prevents code-splitting, ensuring a single file
      },
    },
  },
})
