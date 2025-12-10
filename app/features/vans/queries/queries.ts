import { getCursorPaginationInformation } from '~/features/pagination/utils/get-cursor-pagination-information.server';
import { prisma } from '~/lib/prisma.server';
import type { Direction, Maybe } from '~/types/types';
import type { MaybeTypeFilter } from '../types';

export function getVans(
	cursor: Maybe<string>,
	limit: number,
	typeFilter: MaybeTypeFilter,
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

export function getVansCount(typeFilter: MaybeTypeFilter) {
	return prisma.van.count({
		where: {
			type: typeFilter,
		},
	});
}

export function getVanBySlug(slug: string) {
	return prisma.van.findUnique({
		where: {
			slug,
		},
	});
}
