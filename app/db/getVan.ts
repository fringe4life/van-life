import { prisma } from '~/lib/prisma';

export async function getVan(id: string) {
	return await prisma.van.findUnique({
		where: {
			id,
		},
		include: {
			rent: {
				where: {
					vanId: id,
				},
			},
		},
	});
}
