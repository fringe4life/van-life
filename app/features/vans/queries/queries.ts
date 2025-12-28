import type { Direction } from '~/features/pagination/types';
import { getCursorMetadata } from '~/features/pagination/utils/get-cursor-metadata.server';
import { prisma } from '~/lib/prisma.server';
import type { Maybe } from '~/types/types';
import type { MaybeTypeFilter } from '../types';

export function getVans(
	cursor: Maybe<string>,
	limit: number,
	typeFilter: MaybeTypeFilter,
	direction: Direction = 'forward'
) {
	const { actualCursor, ...rest } = getCursorMetadata({
		cursor,
		limit,
		direction,
	});

	return prisma.van.findMany({
		where: {
			type: typeFilter,
		},
		// Cursor pagination requires ordering by a unique, sequential field
		cursor: actualCursor,
		...rest,
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
