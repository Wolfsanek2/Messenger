import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), svgr({ include: '**/*.svg?react' })],
	base: '/Messenger/',
	resolve: {
		alias: {
			'@shared': path.resolve(__dirname, './src/shared'),
			'@entities': path.resolve(__dirname, './src/entities'),
			'@widgets': path.resolve(__dirname, './src/widgets'),
			'@pages': path.resolve(__dirname, './src/pages'),
			'@app': path.resolve(__dirname, './src/app'),
		},
	},
});
