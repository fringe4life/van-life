import { isCUID } from '~/lib/checkIsCUID.server';
import { prisma } from '~/lib/prisma.server';
export async function getHostRentedVan(rentId: string) {
	if (!isCUID(rentId)) return 'Something went wrong, please try again later';
	return prisma.rent.findUnique({
		where: {
			id: rentId,
		},
		include: {
			van: true,
		},
	});
}
