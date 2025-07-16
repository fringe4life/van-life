import { prisma } from '~/lib/prisma';

// import prisma from '~/lib/prisma';
import getSkipAmount from '~/utils/getSkipAmount';
export async function getHostRents(
	id: string,
	page: number,
	limit: number,
) {
	const skip = getSkipAmount(page, limit);
	console.log({skip, limit})
	return prisma.rent.findMany({
		where: {
			renterId:id,
			AND :{
				rentedTo: null
			}
		},
		take: limit,
		skip,
	});
}
