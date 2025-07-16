import { prisma } from '~/lib/prisma';
import getSkipAmount from '~/utils/getSkipAmount';

export async function getHostRentedVans(
	userId: string,
	page: number,
	take: number,
) {
	const skip = getSkipAmount(page, take);
	return prisma.rent.findMany({
		where: {
			renterId: userId,
		},
		include: {
			van: true,
		},

		skip,
		take,
	});
}
