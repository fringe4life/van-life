import { INVALID_ID_ERROR } from '~/constants/constants';
import { isCUID } from '~/lib/checkIsCUID.server';
import { prisma } from '~/lib/prisma.server';

export function getHostRentedVan(rentId: string) {
	if (!isCUID(rentId)) {
		throw new Error(INVALID_ID_ERROR);
	}
	return prisma.rent.findUnique({
		where: {
			id: rentId,
		},
		include: {
			van: true,
		},
	});
}
