import { prisma } from '~/lib/prisma';

export async function getHostVan(hostId: string, id: string) {
	return prisma.van.findUnique({
		where: {
			id,
			hostId,
		},
	});
}
