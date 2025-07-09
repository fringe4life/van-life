// import { PrismaPg } from "@prisma/adapter-pg";
// import type { SqlDriverAdapterFactory } from "@prisma/client/runtime/client";
import { PrismaClient } from "@prisma/client";

// const connectionString = `${process.env.DATABASE_URL}`;

// const adapter = new PrismaPg({ connectionString }) as SqlDriverAdapterFactory;

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
