import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import { env } from './env.server';

declare global {
	var __prisma: PrismaClient | undefined;
}

const adapter = new PrismaNeon({ connectionString: env.DATABASE_URL });

export const prisma =
	globalThis.__prisma ||
	new PrismaClient({
		adapter,
		log:
			process.env.NODE_ENV === 'development'
				? ['query', 'warn', 'error']
				: ['error'],
	});

if (process.env.NODE_ENV !== 'production') {
	globalThis.__prisma = prisma;
}
