import { INVALID_ID_ERROR } from '~/constants/constants';
import { isCUID } from '~/lib/checkIsCUID.server';
import { prisma } from '~/lib/prisma.server';
import getSkipAmount from '~/utils/getSkipAmount';

export async function getHostRents(id: string, page: number, limit: number) {
	if (!isCUID(id)) return INVALID_ID_ERROR;
	const skip = getSkipAmount(page, limit);

	return prisma.rent.findMany({
		where: {
			renterId: id,
			AND: {
				rentedTo: null,
			},
		},
		take: limit,
		skip,
	});
}
