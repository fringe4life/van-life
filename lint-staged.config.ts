import type { Configuration } from 'lint-staged';
export default {
	'*.{js,jsx,ts,tsx,json,jsonc,css,scss,md,mdx}':
		'bun x ultracite fix --unsafe true',
	'**/*.{ts,tsx}': () => 'bun run typecheck',
} satisfies Configuration;
