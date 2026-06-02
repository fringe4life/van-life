import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { varlockCloudflareVitePlugin } from '@varlock/cloudflare-integration';
import { reactRouterDevTools } from 'react-router-devtools';
import { defineConfig } from 'vite';
import babel from 'vite-plugin-babel';
import googleFonts from 'vite-plugin-google-fonts';
import tsconfigPaths from 'vite-tsconfig-paths';
export default defineConfig({
	plugins: [
		varlockCloudflareVitePlugin({ viteEnvironment: { name: 'ssr' } }),
		reactRouterDevTools(),
		tsconfigPaths(),
		googleFonts({
			entry: 'app/root.tsx',
			tailwind: {
				cssEntry: 'app/app.css',
			},
			fonts: {
				Inter: {
					variable: '--font-sans',
					subsets: ['latin'],
				},
			},
		}),
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
