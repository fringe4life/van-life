import { isCUID } from '~/lib/checkIsCUID.server';
import { prisma } from '~/lib/prisma.server';

export async function getHostRentedVanCount(renterId: string) {
	if (!isCUID(renterId)) return 'Something went wrong, please try again later';
	return prisma.rent.count({
		where: {
			renterId,
			AND: {
				rentedTo: null,
			},
		},
	});
}
