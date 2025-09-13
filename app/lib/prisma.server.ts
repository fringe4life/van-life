import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';
// import { PrismaClient } from '@prisma/client';
import { PrismaClient } from '~/generated/prisma/client';
import { env } from './env.server';

// Configure Neon for optimal performance
neonConfig.webSocketConstructor = ws;
neonConfig.poolQueryViaFetch = true;
neonConfig.pipelineConnect = false; // Disabled because using SSL authentication
neonConfig.coalesceWrites = true; // Reduce network overhead

declare global {
	var prisma: PrismaClient | undefined;
	var neonAdapter: PrismaNeon | undefined;
}

// Create a singleton adapter with connection pooling
const createAdapter = () => {
	if (global.neonAdapter) {
		return global.neonAdapter;
	}

	global.neonAdapter = new PrismaNeon({
		connectionString: env.DATABASE_URL,
	});

	return global.neonAdapter;
};

const adapter = createAdapter();

const db =
	global.prisma ||
	new PrismaClient({
		adapter,
		// Additional Prisma optimizations
		log: ['error'], // Only log errors to reduce terminal clutter
	});

if (process.env.NODE_ENV === 'development') {
	global.prisma = db;
}

export { db as prisma };
