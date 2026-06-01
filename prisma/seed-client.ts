import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '~/generated/prisma-seed/client';
import { env } from '~/lib/env.server';

neonConfig.poolQueryViaFetch = true;
neonConfig.pipelineConnect = false;
neonConfig.coalesceWrites = true;

const adapter = new PrismaNeon({
	connectionString: env.DATABASE_URL,
});

export const prisma = new PrismaClient({
	adapter,
	log: ['error'],
});
