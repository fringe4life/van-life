import { prisma } from '~/lib/prisma.server';
export async function getHostRentedVan(rentId: string) {
	return prisma.rent.findUnique({
		where: {
			id: rentId,
		},
		include: {
			van: true,
		},
	});
}
