import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';
import { env } from './env.server';

neonConfig.webSocketConstructor = ws;

// To work in edge environments (Cloudflare Workers, Vercel Edge, etc.), enable querying over fetch
// neonConfig.poolQueryViaFetch = true

declare global {
	var prisma: PrismaClient | undefined;
}

const adapter = new PrismaNeon({ connectionString: env.DATABASE_URL });

const db = global.prisma || new PrismaClient({ adapter });
if (process.env.NODE_ENV === 'development') global.prisma = db;
export { db as prisma };
