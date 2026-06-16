import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { varlockCloudflareVitePlugin } from '@varlock/cloudflare-integration';
import { reactRouterDevTools } from 'react-router-devtools';
import { defineConfig } from 'vite';
import babel from 'vite-plugin-babel';
import tsconfigPaths from 'vite-tsconfig-paths';
export default defineConfig({
	plugins: [
		varlockCloudflareVitePlugin({ viteEnvironment: { name: 'ssr' } }),
		reactRouterDevTools(),
		tsconfigPaths(),
		tailwindcss(),
		babel({
			include: /\.[jt]sx?$/,
			exclude: /node_modules/,
			babelConfig: {
				presets: ['@babel/preset-typescript'],
				plugins: ['babel-plugin-react-compiler'],
				compact: false,
			},
		}),
		reactRouter(),
	],
	// reenable when migrating to vite 8
	// resolve: {
	// 	tsconfigPaths: true,
	// },
	// server: {
	// 	forwardConsole: true,
	// },
});
