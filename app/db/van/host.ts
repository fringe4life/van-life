import { INVALID_ID_ERROR } from '~/constants/constants';
import { isCUID } from '~/lib/checkIsCUID.server';
import { prisma } from '~/lib/prisma.server';
import getSkipAmount from '~/utils/getSkipAmount.server';
// import prisma from '~/lib/prisma';

export async function getHostVan(userId: string, vanId: string) {
	if (!isCUID(userId) || !isCUID(vanId)) return INVALID_ID_ERROR;
	return prisma.van.findUnique({
		where: {
			id: vanId,
			hostId: userId,
		},
	});
}

export function getHostVans(hostId: string, page: number, limit: number) {
	if (!isCUID(hostId)) return INVALID_ID_ERROR;
	const skip = getSkipAmount(page, limit);
	return prisma.van.findMany({
		where: { hostId },
		orderBy: { id: 'desc' },
		take: limit,
		skip,
	});
}

export function getHostVanCount(hostId: string) {
	if (!isCUID(hostId)) return INVALID_ID_ERROR;
	return prisma.van.count({
		where: {
			hostId,
		},
	});
}
