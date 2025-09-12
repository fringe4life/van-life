import 'dotenv/config';
import type { PrismaConfig } from 'prisma/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
	schema: 'prisma',
	migrations: {
		path: 'prisma/migrations',
		seed: 'tsx prisma/seed.ts',
	},
} satisfies PrismaConfig);
