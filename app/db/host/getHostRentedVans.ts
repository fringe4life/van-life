import { prisma } from '~/lib/prisma';

// import prisma from '~/lib/prisma';
import getSkipAmount from '~/utils/getSkipAmount';
export async function getHostRentedVans(
	id: string,
	page: number,
	limit: number,
) {
	const skip = getSkipAmount(page, limit);
	return await prisma.rent.findMany({
		where: {
			renterId: id,
			rentedTo: null,
		},
		include: {
			van: true,
		},
		take: limit,
		skip,
	});
}
