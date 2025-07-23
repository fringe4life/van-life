import { prisma } from '~/lib/prisma.server';

// import prisma from '~/lib/prisma';
import getSkipAmount from '~/utils/getSkipAmount';
export async function getHostRents(id: string, page: number, limit: number) {
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
