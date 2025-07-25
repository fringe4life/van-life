import { isCUID } from '~/lib/checkIsCUID';
import { prisma } from '~/lib/prisma.server';
import getSkipAmount from '~/utils/getSkipAmount';

export async function getHostRentedVans(
	userId: string,
	page: number,
	take: number,
) {
	if (!isCUID(userId)) return 'Something went wrong, please try again later';
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
