import { INVALID_ID_ERROR } from '~/constants/constants';
import { isCUID } from '~/lib/checkIsCUID.server';
import { prisma } from '~/lib/prisma.server';

export async function getHostRentedVanCount(renterId: string) {
	if (!isCUID(renterId)) return INVALID_ID_ERROR;
	return prisma.rent.count({
		where: {
			renterId,
			rentedTo: null,
		},
	});
}
