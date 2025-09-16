import { INVALID_ID_ERROR } from '~/constants/constants';
import { getCursorPaginationInformation } from '~/features/pagination/utils/get-cursor-pagination-information.server';
import { prisma } from '~/lib/prisma.server';
import type { Direction } from '~/types/types';
import { isCUID } from '~/utils/check-is-cuid.server';

// biome-ignore lint/suspicious/useAwait: Prisma queries are async and need await
export async function getHostVan(userId: string, vanId: string) {
	if (!(isCUID(userId) && isCUID(vanId))) {
		return INVALID_ID_ERROR;
	}
	return prisma.van.findUnique({
		where: {
			id: vanId,
			hostId: userId,
		},
	});
}

export function getHostVans(
	hostId: string,
	cursor: string | undefined,
	limit: number,
	direction: Direction = 'forward'
) {
	if (!isCUID(hostId)) {
		return INVALID_ID_ERROR;
	}
	const { actualCursor, sortOrder, takeAmount } =
		getCursorPaginationInformation(cursor, limit, direction);

	return prisma.van.findMany({
		where: {
			hostId,
		},
		orderBy: { id: sortOrder },
		cursor: actualCursor ? { id: actualCursor } : undefined,
		skip: actualCursor ? 1 : 0, // Skip the cursor record itself
		take: takeAmount,
	});
}

export function getHostVanCount(hostId: string) {
	if (!isCUID(hostId)) {
		return INVALID_ID_ERROR;
	}
	return prisma.van.count({
		where: {
			hostId,
		},
	});
}
