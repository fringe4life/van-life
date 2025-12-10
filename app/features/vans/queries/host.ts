import { getCursorPaginationInformation } from '~/features/pagination/utils/get-cursor-pagination-information.server';
import { prisma } from '~/lib/prisma.server';
import type { Direction, Maybe } from '~/types/types';

// biome-ignore lint/suspicious/useAwait: Prisma queries are async and need await
export async function getHostVanBySlug(userId: string, vanSlug: string) {
	return prisma.van.findFirst({
		where: {
			slug: vanSlug,
			hostId: userId,
		},
	});
}

export function getHostVans(
	hostId: string,
	cursor: Maybe<string>,
	limit: number,
	direction: Direction = 'forward'
) {
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
	return prisma.van.count({
		where: {
			hostId,
		},
	});
}
