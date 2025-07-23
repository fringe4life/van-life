import { prisma } from '~/lib/prisma.server';
import getSkipAmount from '~/utils/getSkipAmount';

export async function getHostRentedVans(
	userId: string,
	page: number,
	take: number,
) {
	const skip = getSkipAmount(page, take);
	return prisma.rent.findMany({
		include: {
			van: true,
		},

		where: {
			renterId: userId,
			van: {
				isRented: true,
			},
		},
		skip,
		take,
	});
}
