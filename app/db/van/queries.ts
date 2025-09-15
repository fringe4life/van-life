import { getCursorPaginationInformation } from '~/features/pagination/utils/getCursorPaginationInformation.server';
import type { VanType } from '~/generated/prisma/enums';
import { prisma } from '~/lib/prisma.server';
import type { Direction } from '~/types/types';

export function getVans(
	cursor: string | undefined,
	limit: number,
	typeFilter: VanType | undefined,
	direction: Direction = 'forward'
) {
	const { actualCursor, sortOrder, takeAmount } =
		getCursorPaginationInformation(cursor, limit, direction);

	return prisma.van.findMany({
		where: {
			type: typeFilter,
		},
		// Cursor pagination requires ordering by a unique, sequential field
		orderBy: { id: sortOrder },
		cursor: actualCursor ? { id: actualCursor } : undefined,
		skip: actualCursor ? 1 : 0, // Skip the cursor record itself
		take: takeAmount,
	});
}

export function getVansCount(typeFilter: VanType | undefined) {
	return prisma.van.count({
		where: {
			type: typeFilter,
		},
	});
}
