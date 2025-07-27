import { INVALID_ID_ERROR } from '~/constants/constants';
import { isCUID } from '~/lib/checkIsCUID.server';
import { prisma } from '~/lib/prisma.server';
// import prisma from '~/lib/prisma';
import getSkipAmount from '~/utils/getSkipAmount.server';
export async function getHostVans(id: string, page: number, limit: number) {
	if (!isCUID(id)) return INVALID_ID_ERROR;
	const skip = getSkipAmount(page, limit);
	return prisma.van.findMany({
		where: {
			hostId: id,
		},
		take: limit,
		skip,
		orderBy: { id: 'desc' },
	});
}
