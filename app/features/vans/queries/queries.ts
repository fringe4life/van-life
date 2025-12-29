import { getCursorMetadata } from '~/features/pagination/utils/get-cursor-metadata.server';
import { prisma } from '~/lib/prisma.server';
import type { GetVansProps, TypeFilter } from '../types';

export function getVans({
	cursor,
	limit,
	direction,
	typeFilter,
}: GetVansProps) {
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

export function getVansCount({ typeFilter }: TypeFilter) {
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
