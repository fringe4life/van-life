import { INVALID_ID_ERROR } from '~/constants/constants';
import { isCUID } from '~/lib/checkIsCUID.server';
import { prisma } from '~/lib/prisma.server';

export function rentVan(vanId: string, renterId: string, hostId: string) {
	if (!isCUID(vanId) || !isCUID(renterId) || !isCUID(hostId)) {
		throw new Error(INVALID_ID_ERROR);
	}
	return prisma.rent.create({
		data: {
			vanId,
			renterId,
			hostId,
		},
	});
}
