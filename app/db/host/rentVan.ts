import { prisma } from '~/lib/prisma.server';

export async function rentVan(vanId: string, renterId: string, hostId: string) {
	return prisma.rent.create({
		data: {
			vanId,
			renterId,
			hostId,
		},
	});
}
