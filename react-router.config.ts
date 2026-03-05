/** biome-ignore-all lint/style/useNamingConvention: react router naming convention */
import type { Config } from '@react-router/dev/config';

export default {
	ssr: true,
	future: {
		v8_middleware: true,
		// v8_viteEnvironmentApi: true, // must stay off for Netlify plugin function generation
	},
	prerender: ['/', '/about'],
} satisfies Config;
