import type { BasePaginationParams } from '~/features/pagination/types';
import { getCursorMetadata } from '~/features/pagination/utils/get-cursor-metadata.server';
import { prisma } from '~/lib/prisma.server';
import type { UUIDv7 } from '~/types/ids.server';

// biome-ignore lint/suspicious/useAwait: Prisma queries are async and need await
export async function getHostVanBySlug(userId: UUIDv7, vanSlug: string) {
	return prisma.van.findFirst({
		where: {
			hostId: userId,
			slug: vanSlug,
		},
	});
}

export function getHostVans(
	hostId: UUIDv7,
	{ cursor, limit, direction }: BasePaginationParams
) {
	const { actualCursor, ...rest } = getCursorMetadata({
		cursor,
		direction,
		limit,
	});

	return prisma.van.findMany({
		cursor: actualCursor,
		where: {
			hostId,
		},
		...rest,
	});
}
