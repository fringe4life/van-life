/** biome-ignore-all lint/style/useNamingConvention: react router naming convention */
import type { Config } from '@react-router/dev/config';

export default {
	ssr: true,
	future: {
		v8_middleware: true,
		v8_viteEnvironmentApi: true,
		v8_passThroughRequests: true,
		v8_splitRouteModules: true,
		v8_trailingSlashAwareDataRequests: true,
		unstable_optimizeDeps: true,
	},
} satisfies Config;
