import { INVALID_ID_ERROR } from '~/constants/constants';
import { isCUID } from '~/lib/checkIsCUID.server';
import { prisma } from '~/lib/prisma.server';
import getSkipAmount from '~/utils/getSkipAmount.server';

export async function getHostRentedVan(rentId: string) {
	if (!isCUID(rentId)) return INVALID_ID_ERROR;
	return prisma.rent.findUnique({
		where: { id: rentId },
		include: { van: true },
	});
}

export function getHostRentedVans(hostId: string, page: number, limit: number) {
	if (!isCUID(hostId)) return INVALID_ID_ERROR;
	const skip = getSkipAmount(page, limit);
	return prisma.rent.findMany({
		where: {
			hostId,
			AND: {
				rentedTo: null,
			},
		},
		include: { van: true },
		orderBy: { id: 'desc' },
		take: limit,
		skip,
	});
}

export function getHostRentedVanCount(hostId: string) {
	if (!isCUID(hostId)) return INVALID_ID_ERROR;
	return prisma.rent.count({
		where: {
			hostId,
			AND: {
				rentedTo: null,
			},
		},
	});
}

export function getHostRents(id: string, page: number, limit: number) {
	if (!isCUID(id)) return INVALID_ID_ERROR;
	const skip = getSkipAmount(page, limit);

	return prisma.rent.findMany({
		where: {
			renterId: id,
			AND: {
				rentedTo: null,
			},
		},
		take: limit,
		skip,
	});
}
