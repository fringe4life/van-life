import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';


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
			'~': '/home/cc/Programming/Scrimba-FrontendPath/van-life/app',
		},
		// Ensure proper symlink handling
		preserveSymlinks: false,
	},
	plugins: [
		tailwindcss(),
		reactRouter(),
		tsconfigPaths(),
	],
});
