import type { Config } from '@react-router/dev/config';
import { vercelPreset } from '@vercel/react-router/vite';

export default {
	ssr: true,
	presets: [vercelPreset()],
	future: {
		// biome-ignore lint/style/useNamingConvention: a react router v7 flag
		v8_middleware: true,
	},
} satisfies Config;
