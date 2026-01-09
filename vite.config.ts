import netlify from '@netlify/vite-plugin'; // <- add this (optional)
import netlifyReactRouter from '@netlify/vite-plugin-react-router'; // <- add this
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { reactRouterDevTools } from 'react-router-devtools';
import { defineConfig, type UserConfig } from 'vite';
import babel from 'vite-plugin-babel';
export default defineConfig({
	plugins: [
		reactRouterDevTools({
			// biome-ignore lint/style/useNamingConvention: the property is experimental
			experimental_codegen: { enabled: true },
		}),
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
		netlifyReactRouter(), // <- add this
		netlify(), // <- add this (optional)
	],
	resolve: {
		tsconfigPaths: true,
	},
} satisfies UserConfig);
