import { prisma } from '~/lib/prisma';
// import prisma from '~/lib/prisma';
export async function returnVan(
	vanId: string,
	renterId: string,
	rentId: string,
) {
	return prisma.rent.update({
		where: {
			id: rentId,
		},
		data: {},
	});
}
