import type { Direction } from '~/features/pagination/types';
import { getCursorPaginationInformation } from '~/features/pagination/utils/get-cursor-metadata.server';
import { prisma } from '~/lib/prisma.server';
import type { Maybe } from '~/types/types';
import type { MaybeTypeFilter } from '../types';

export function getVans(
	cursor: Maybe<string>,
	limit: number,
	typeFilter: MaybeTypeFilter,
	direction: Direction = 'forward'
) {
	const { actualCursor, skip, sortOrder, take } =
		getCursorPaginationInformation({ cursor, limit, direction });

	return prisma.van.findMany({
		where: {
			type: typeFilter,
		},
		// Cursor pagination requires ordering by a unique, sequential field
		orderBy: { id: sortOrder },
		cursor: actualCursor ? { id: actualCursor } : undefined,
		skip, // Skip the cursor record itself
		take,
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
