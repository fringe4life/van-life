import { isCUID } from '~/lib/checkIsCUID';
import { prisma } from '~/lib/prisma.server';

export async function rentVan(vanId: string, renterId: string, hostId: string) {
	if (!isCUID(vanId) || !isCUID(renterId) || !isCUID(hostId))
		return 'Something went wrong, please try again later';
	return prisma.rent.create({
		data: {
			vanId,
			renterId,
			hostId,
		},
	});
}
