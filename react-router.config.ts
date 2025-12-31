/** biome-ignore-all lint/style/useNamingConvention: react router naming convention */
import type { Config } from '@react-router/dev/config';
import { vercelPreset } from '@vercel/react-router/vite';

export default {
	ssr: true,
	presets: [vercelPreset()],
	future: {
		v8_middleware: true,
		v8_splitRouteModules: 'enforce',
		v8_viteEnvironmentApi: true,
	},
	prerender: ['/', '/about'],
} satisfies Config;
