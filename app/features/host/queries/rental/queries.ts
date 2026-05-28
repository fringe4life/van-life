import type { BasePaginationParams } from '~/features/pagination/types';
import { getCursorMetadata } from '~/features/pagination/utils/get-cursor-metadata.server';
import { prisma } from '~/lib/prisma.server';

// biome-ignore lint/suspicious/useAwait: Prisma queries are async and need await
export async function getHostRentedVan(rentId: string) {
	return prisma.rent.findUnique({
		where: { id: rentId },
		include: { van: true },
	});
}

export function getHostRentedVans(
	hostId: string,
	{ cursor, limit, direction }: BasePaginationParams
) {
	const { actualCursor, ...rest } = getCursorMetadata({
		cursor,
		limit,
		direction,
	});

	return prisma.rent.findMany({
		where: {
			hostId,
			AND: {
				rentedTo: null,
			},
		},
		include: { van: true },
		cursor: actualCursor,
		...rest,
	});
}
