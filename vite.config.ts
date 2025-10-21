import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type UserConfig } from 'vite';
import babel from 'vite-plugin-babel';
import tsconfigPaths from 'vite-tsconfig-paths';
export default defineConfig({
	plugins: [
		tailwindcss(),
		babel({
			filter: /\.[jt]sx?$/,
			babelConfig: {
				presets: ['@babel/preset-typescript'], // if you use TypeScript
				plugins: ['babel-plugin-react-compiler'],
				compact: false, // Disable compact mode to keep code optimized even for large files
			},
		}),
		reactRouter(),
		tsconfigPaths(),
	],
} satisfies UserConfig);
