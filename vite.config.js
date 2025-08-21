import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@/components': path.resolve(__dirname, './src/common/components'),
            '@/hooks': path.resolve(__dirname, './src/common/hooks'),
            '@/utils': path.resolve(__dirname, './src/common/utils'),
            '@/services': path.resolve(__dirname, './src/common/services'),
            '@/api': path.resolve(__dirname, './src/common/api'),
            '@/constants': path.resolve(__dirname, './src/common/constants'),
            '@/types': path.resolve(__dirname, './src/common/types'),
            '@/modules': path.resolve(__dirname, './src/modules'),
            '@/styles': path.resolve(__dirname, './src/styles'),
        }
    },
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    },
    build: {
        outDir: 'build',
        sourcemap: true
    }
});
