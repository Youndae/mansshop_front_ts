import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
	alias: {
		'@': path.resolve(__dirname, './src'),
		'@/assets': path.resolve(__dirname, './src/assets'),
		'@/common': path.resolve(__dirname, './src/common'),
		'@/modules': path.resolve(__dirname, './src/modules'),
		'@/routes': path.resolve(__dirname, './src/routes'),
		'@/styles': path.resolve(__dirname, './src/styles'),
	}
  },
  define: {
    global: 'globalThis',
    'process.env': {},
    'globalThis.global': 'globalThis',
  },
  server: {
	port: 3000,
	proxy: {
		'/api': {
			target: 'http://localhost:8080',
			changeOrigin: true,
			rewrite: (path) => path.replace(/^\/api/, '')
		},
		'/ws': {
			target: 'http://localhost:8080',
			changeOrigin: true,
			ws: true,
		}
	}
  },
  build: {
	outDir: 'build',
	sourcemap: true
  }
})
