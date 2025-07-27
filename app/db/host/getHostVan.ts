import { INVALID_ID_ERROR } from '~/constants/constants';
import { isCUID } from '~/lib/checkIsCUID.server';
import { prisma } from '~/lib/prisma.server';
// import prisma from '~/lib/prisma';
export function getHostVan(hostId: string, id: string) {
	if (!isCUID(id) || !isCUID(hostId)) {
		throw new Error(INVALID_ID_ERROR);
	}
	return prisma.van.findUnique({
		where: {
			id,
			hostId,
		},
	});
}
