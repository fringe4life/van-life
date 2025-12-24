import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { reactRouterDevTools } from 'react-router-devtools';
import { defineConfig, type UserConfig } from 'vite';
import babel from 'vite-plugin-babel';
export default defineConfig({
	plugins: [
		reactRouterDevTools(),
		tailwindcss(),
		babel({
			filter: /\.[jt]sx?$/,
			babelConfig: {
				presets: ['@babel/preset-typescript'],
				plugins: ['babel-plugin-react-compiler'],
				compact: false, // Disable compact mode to keep code optimized even for large files
			},
		}),
		reactRouter(),
	],
	resolve: {
		tsconfigPaths: true,
	},
} satisfies UserConfig);
