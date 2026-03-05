import type { Configuration } from 'lint-staged';
export default {
	'*.{js,jsx,ts,tsx,json,jsonc,css,scss,md,mdx}': () => 'bun fix',
	'**/*.{ts,tsx}': () => 'bun typecheck',
} satisfies Configuration;
