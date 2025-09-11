import 'dotenv/config';
import { defineConfig } from 'prisma/config';
import type { PrismaConfig } from 'prisma/config';



export default defineConfig({
	schema: 'prisma',
	migrations: {
		seed: 'tsx prisma/seed.ts',
	},
} satisfies PrismaConfig) ;


