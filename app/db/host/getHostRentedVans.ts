import { INVALID_ID_ERROR } from '~/constants/constants';
import { isCUID } from '~/lib/checkIsCUID.server';
import { prisma } from '~/lib/prisma.server';
import getSkipAmount from '~/utils/getSkipAmount.server';

export async function getHostRentedVans(
	userId: string,
	page: number,
	take: number,
) {
	if (!isCUID(userId)) return INVALID_ID_ERROR;
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
