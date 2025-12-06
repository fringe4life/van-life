import type { VanModel } from '~/generated/prisma/models';
import { prisma } from '~/lib/prisma.server';

export function createVan(
	newVan: Omit<VanModel, 'id' | 'createdAt' | 'isRented'>
) {
	return prisma.van.create({
		data: { ...newVan, createdAt: new Date(), isRented: false },
	});
}

export function getVan(id: string) {
	return prisma.van.findUnique({
		where: { id },
	});
}
