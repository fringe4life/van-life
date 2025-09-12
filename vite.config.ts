import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	experimental: {
		enableNativePlugin: true,
	},
	// Use Oxc/Rolldown configuration instead of deprecated esbuildOptions
	optimizeDeps: {
		rollupOptions: {
			resolve: {
				// Handle symlinks properly for rolldown-vite
				symlinks: true,
			},
		},
	},
	// Configure resolve to handle ~/ paths properly
	resolve: {
		alias: {
			'~': path.resolve(__dirname, 'app'),
		},
		// Ensure proper symlink handling
		preserveSymlinks: false,
	},
	plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
});
