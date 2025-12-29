import type { BasePaginationParams } from '~/features/pagination/types';
import { getCursorMetadata } from '~/features/pagination/utils/get-cursor-metadata.server';
import { prisma } from '~/lib/prisma.server';

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
	{ cursor, limit, direction }: BasePaginationParams
) {
	const { actualCursor, ...rest } = getCursorMetadata({
		cursor,
		limit,
		direction,
	});

	return prisma.van.findMany({
		where: {
			hostId,
		},
		cursor: actualCursor,
		...rest,
	});
}

export function getHostVanCount(hostId: string) {
	return prisma.van.count({
		where: {
			hostId,
		},
	});
}
