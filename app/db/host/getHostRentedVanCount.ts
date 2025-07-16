import { prisma } from '~/lib/prisma';

export async function getHostRentedVanCount(renterId: string) {
	return prisma.rent.count({
		where: {
			renterId,
			AND: {
				rentedTo: null,
			},
		},
	});
}
