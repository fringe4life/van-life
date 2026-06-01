import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '~/generated/prisma/client';
import type { Maybe } from '~/types';
import { env } from './env.server';

neonConfig.poolQueryViaFetch = true;
neonConfig.pipelineConnect = false;
neonConfig.coalesceWrites = true;

if (typeof WebSocket !== 'undefined') {
	neonConfig.webSocketConstructor = WebSocket;
}

declare global {
	var prisma: Maybe<PrismaClient>;
	var neonAdapter: Maybe<PrismaNeon>;
}

const createAdapter = () => {
	if (import.meta.env?.DEV && globalThis.neonAdapter) {
		return globalThis.neonAdapter;
	}

	const adapter = new PrismaNeon({
		connectionString: env.DATABASE_URL,
	});

	if (import.meta.env?.DEV) {
		globalThis.neonAdapter = adapter;
	}

	return adapter;
};

const createPrismaClient = () => {
	if (import.meta.env?.DEV && globalThis.prisma) {
		return globalThis.prisma;
	}

	const client = new PrismaClient({
		adapter: createAdapter(),
		log: ['error'],
	});

	if (import.meta.env?.DEV) {
		globalThis.prisma = client;
	}

	return client;
};

// biome-ignore lint/suspicious/noRedeclare: redeclare global
export const prisma = createPrismaClient();
