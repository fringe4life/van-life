import { prisma } from '~/lib/prisma';
import getSkipAmount from '~/utils/getSkipAmount';

export async function getHostVans(id: string, page: number, limit: number) {
	const skip = getSkipAmount(page, limit);
	return prisma.van.findMany({
		where: {
			hostId: id,
		},
		take: limit,
		skip,
	});
}
