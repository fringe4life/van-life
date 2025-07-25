import { isCUID } from '~/lib/checkIsCUID';
import { prisma } from '~/lib/prisma.server';
// import prisma from '~/lib/prisma';
export async function getHostVan(hostId: string, id: string) {
	if (!isCUID(id) || !isCUID(hostId))
		return 'Something went wrong, please try again later';
	return prisma.van.findUnique({
		where: {
			id,
			hostId,
		},
	});
}
