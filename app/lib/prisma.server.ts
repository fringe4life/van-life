import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';
// import { PrismaClient } from '@prisma/client';
import { PrismaClient } from '~/generated/prisma';
import { env } from './env.server';

// Only configure WebSocket constructor in production
neonConfig.webSocketConstructor = ws;
// Enable fetch-based queries for better reliability in edge environments
neonConfig.poolQueryViaFetch = true;

declare global {
	var prisma: PrismaClient | undefined;
}

const adapter = new PrismaNeon({ connectionString: env.DATABASE_URL });

const db = global.prisma || new PrismaClient({ adapter });
if (process.env.NODE_ENV === 'development') global.prisma = db;

export { db as prisma };
