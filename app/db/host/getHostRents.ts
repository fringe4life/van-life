import { isCUID } from '~/lib/checkIsCUID';
import { prisma } from '~/lib/prisma.server';
// import prisma from '~/lib/prisma';
import getSkipAmount from '~/utils/getSkipAmount';
export async function getHostRents(id: string, page: number, limit: number) {
	if (!isCUID(id)) return 'Something went wrong, please try again later';
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
