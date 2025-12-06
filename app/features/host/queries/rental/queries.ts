import { getCursorPaginationInformation } from '~/features/pagination/utils/get-cursor-pagination-information.server';
import { prisma } from '~/lib/prisma.server';
import type { Direction } from '~/types/types';

// biome-ignore lint/suspicious/useAwait: Prisma queries are async and need await
export async function getHostRentedVan(rentId: string) {
	return prisma.rent.findUnique({
		where: { id: rentId },
		include: { van: true },
	});
}

export function getHostRentedVans(
	hostId: string,
	cursor: string | undefined,
	limit: number,
	direction: Direction = 'forward'
) {
	const { actualCursor, sortOrder, takeAmount } =
		getCursorPaginationInformation(cursor, limit, direction);

	return prisma.rent.findMany({
		where: {
			hostId,
			AND: {
				rentedTo: null,
			},
		},
		include: { van: true },
		orderBy: { id: sortOrder },
		cursor: actualCursor ? { id: actualCursor } : undefined,
		skip: actualCursor ? 1 : 0, // Skip the cursor record itself
		take: takeAmount,
	});
}

export function getHostRentedVanCount(hostId: string) {
	return prisma.rent.count({
		where: {
			hostId,
			AND: {
				rentedTo: null,
			},
		},
	});
}

export function getHostRents(
	id: string,
	cursor: string | undefined,
	limit: number,
	direction: Direction = 'forward'
) {
	const { actualCursor, sortOrder, takeAmount } =
		getCursorPaginationInformation(cursor, limit, direction);

	return prisma.rent.findMany({
		where: {
			renterId: id,
			AND: {
				rentedTo: null,
			},
		},
		orderBy: { id: sortOrder },
		cursor: actualCursor ? { id: actualCursor } : undefined,
		skip: actualCursor ? 1 : 0, // Skip the cursor record itself
		take: takeAmount,
	});
}
