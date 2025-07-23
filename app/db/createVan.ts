import type { Van } from '@prisma/client';
import { prisma } from '~/lib/prisma.server';
// import prisma from '~/lib/prisma';

export async function createVan(
	newVan: Omit<Van, 'id' | 'createdAt' | 'isRented'>,
) {
	return prisma.van.create({
		data: { ...newVan, createdAt: new Date(), isRented: false },
	});
}
