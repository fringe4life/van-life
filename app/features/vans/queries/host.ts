import type { Direction } from '~/features/pagination/types';
import { getCursorPaginationInformation } from '~/features/pagination/utils/get-cursor-metadata.server';
import { prisma } from '~/lib/prisma.server';
import type { Maybe } from '~/types/types';

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
	const { actualCursor, skip, sortOrder, take } =
		getCursorPaginationInformation({ cursor, limit, direction });

	return prisma.van.findMany({
		where: {
			hostId,
		},
		orderBy: { id: sortOrder },
		cursor: actualCursor ? { id: actualCursor } : undefined,
		skip, // Skip the cursor record itself
		take,
	});
}

export function getHostVanCount(hostId: string) {
	return prisma.van.count({
		where: {
			hostId,
		},
	});
}
