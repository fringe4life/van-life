import type { BasePaginationParams } from '~/features/pagination/types';
import { getCursorMetadata } from '~/features/pagination/utils/get-cursor-metadata.server';
import { prisma } from '~/lib/prisma.server';
import type { UUIDv7 } from '~/types/ids.server';

// biome-ignore lint/suspicious/useAwait: Prisma queries are async and need await
export async function getHostRentedVan(rentId: UUIDv7, renterId: UUIDv7) {
	return prisma.rent.findFirst({
		include: { van: true },
		where: {
			id: rentId,
			rentedTo: null,
			renterId,
		},
	});
}

export function getHostRentedVans(
	renterId: UUIDv7,
	{ cursor, limit, direction }: BasePaginationParams
) {
	const { actualCursor, ...rest } = getCursorMetadata({
		cursor,
		direction,
		limit,
	});

	return prisma.rent.findMany({
		cursor: actualCursor,
		include: { van: true },
		where: {
			rentedTo: null,
			renterId,
		},
		...rest,
	});
}
