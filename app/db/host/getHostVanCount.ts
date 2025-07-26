import { isCUID } from '~/lib/checkIsCUID.server';
import { prisma } from '~/lib/prisma.server';
// import prisma from '~/lib/prisma';
export async function getHostVanCount(hostId: string) {
	if (!isCUID(hostId)) return 'Something went wrong, please try again later';
	return await prisma.van.count({
		where: {
			hostId,
		},
	});
}
