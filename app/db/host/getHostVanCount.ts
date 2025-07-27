import { INVALID_ID_ERROR } from '~/constants/constants';
import { isCUID } from '~/lib/checkIsCUID.server';
import { prisma } from '~/lib/prisma.server';
// import prisma from '~/lib/prisma';
export async function getHostVanCount(hostId: string) {
	if (!isCUID(hostId)) return INVALID_ID_ERROR;
	return prisma.van.count({
		where: {
			hostId,
		},
	});
}
