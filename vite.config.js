import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
var config = {
    plugins: [react()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './src/test/setup.ts',
    },
};
export default defineConfig(config);
