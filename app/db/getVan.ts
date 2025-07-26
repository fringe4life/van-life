import { isCUID } from '~/lib/checkIsCUID.server';
import { prisma } from '~/lib/prisma.server';
// import prisma from '~/lib/prisma';
export async function getVan(id: string) {
	if (!isCUID(id)) return 'Something went wrong, please try again later';
	return prisma.van.findUnique({
		where: {
			id,
		},
		// todo fix this to be more more performant
		include: {
			rent: {
				where: {
					vanId: id,
					AND: {
						rentedTo: null,
					},
				},
				select: {
					id: true,
					rentedTo: true,
				},
			},
		},
	});
}
