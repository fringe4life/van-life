import { prisma } from '~/lib/prisma';
export async function getHostRentedVan(vanId: string) {
	return prisma.van.findUnique({
		where: {
			id: vanId,
		},
	});
}
