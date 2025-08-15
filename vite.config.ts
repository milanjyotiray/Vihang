import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'
import { fileURLToPath } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // PWA disabled temporarily - enable after fixing configuration
  ],
  resolve: {
    alias: {
      "@": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "./src"),
      "@shared": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "./shared"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Enable minification and compression
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.debug', 'console.info'],
      },
    },
    rollupOptions: {
      output: {
        // Better chunk naming for caching
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: {
          // Vendor chunks for better caching
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-toast', '@radix-ui/react-tooltip', '@radix-ui/react-checkbox', '@radix-ui/react-label', '@radix-ui/react-slot'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'query-vendor': ['@tanstack/react-query'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'utils-vendor': ['lucide-react', 'clsx', 'tailwind-merge', 'class-variance-authority', 'wouter']
        },
      },
      // Optimize dependencies
      external: [],
    },
    // Increase chunk size warning limit since we're properly chunking now
    chunkSizeWarningLimit: 600,
    // Enable build optimizations
    target: 'esnext',
    cssCodeSplit: true,
    assetsInlineLimit: 4096, // Inline small assets as base64
  },
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@radix-ui/react-dialog',
      '@radix-ui/react-select',
      '@radix-ui/react-toast',
      '@radix-ui/react-tooltip',
      '@supabase/supabase-js',
      '@tanstack/react-query',
      'wouter',
    ],
  },
  // Enable experimental features for better performance
  experimental: {
    renderBuiltUrl(filename) {
      // Add version hash to assets for better caching
      return `/${filename}`;
    }
  },
})
