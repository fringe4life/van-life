import type { PrismaConfig } from 'prisma/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
	datasource: {
		url: process.env.DATABASE_URL ?? 'postgresql://ci:ci@127.0.0.1:5432/ci',
	},
	migrations: {
		path: 'prisma/migrations',
		seed: 'bun run prisma/seed.ts',
	},
	schema: 'prisma',
} satisfies PrismaConfig);
