import { defineConfig, splitVendorChunkPlugin } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [ svelte({}), splitVendorChunkPlugin() ],
  server: {
    open: '/test/index.html'
  },
  build: {
    sourcemap: true,
    lib: {
      entry: './src/index.js',
      name: 'Mappola',
      formats: ['umd'],
      fileName: () => 'mappola-maps.js',
    },
    rollupOptions: {
      output: {
        assetFileNames: 'mappola-maps.[ext]'
      }
    }
  }
});