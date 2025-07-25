import { isCUID } from '~/lib/checkIsCUID';
import { prisma } from '~/lib/prisma.server';
// import prisma from '~/lib/prisma';
import getSkipAmount from '~/utils/getSkipAmount';
export async function getHostVans(id: string, page: number, limit: number) {
	if (!isCUID(id)) return 'Something went wrong, please try again later';
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
