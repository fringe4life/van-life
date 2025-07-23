// import { PrismaPg } from '@prisma/adapter-pg';
// import type { SqlDriverAdapterFactory } from '@prisma/client/runtime/library';

// import { PrismaClient } from '~/generated/prisma/client';
// // import { env } from '~/utils/env.server';

// export type GetDbParams = {
// 	connectionString: string;
// };

// export function getDb({ connectionString }: GetDbParams) {
// 	const pool = new PrismaPg({ connectionString }) as SqlDriverAdapterFactory;
// 	const prisma = new PrismaClient({ adapter: pool });
// 	return prisma;
// }
// const prisma = getDb({ connectionString: process.env.DIRECT_URL! });
// export default prisma;

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
//
