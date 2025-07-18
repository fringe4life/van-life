import { prisma } from '~/lib/prisma';
// import prisma from '~/lib/prisma';
export async function getVan(id: string) {
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
