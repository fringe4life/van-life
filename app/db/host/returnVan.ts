import { prisma } from '~/lib/prisma';
// import prisma from '~/lib/prisma';
export async function returnVan(rentId: string) {
	return prisma.rent.update({
		where: {
			id: rentId,
		},
		data: {
			rentedTo: new Date(),
		},
	});
}
