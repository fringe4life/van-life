import type { ReactDoctorConfig } from 'react-doctor/api';

export default {
	diff: false,
	verbose: true,
	share: false,
	ignore: {
		files: ['build', 'app/generated/**'],
		rules: [
			'react-doctor/only-export-components',
			'react-doctor/server-auth-actions',
			'deslop/unused-file',
			'deslop/unused-dependency',
			'deslop/unused-dev-dependency',
		],
		overrides: [
			{
				files: ['app/root.tsx'],
				rules: ['react-doctor/no-multi-comp'],
			},
			{
				files: ['app/features/host/components/review/rating-stars.tsx'],
				rules: ['react-doctor/no-array-index-as-key'],
			},
		],
	},
} satisfies ReactDoctorConfig;
