import { prisma } from '~/lib/prisma';
export async function getHostRentedVan(rentId: string) {
	return prisma.rent.findUnique({
		where: {
			id: rentId,
			rentedTo: null,
		},
		include: {
			van: true,
		},
	});
}
