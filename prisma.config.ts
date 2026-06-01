import type { PrismaConfig } from 'prisma/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
	schema: 'prisma',
	migrations: {
		path: 'prisma/migrations',
		seed: 'bun run prisma/seed.ts',
	},
	datasource: {
		url: process.env.DATABASE_URL ?? 'postgresql://ci:ci@127.0.0.1:5432/ci',
	},
}) as PrismaConfig;
