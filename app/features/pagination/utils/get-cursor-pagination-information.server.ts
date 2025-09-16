import type { Prisma } from '~/generated/prisma/client';
import type { Direction } from '~/types/types';

/**
 * Generalized cursor pagination utility that provides all necessary information
 * for Prisma cursor-based pagination queries.
 *
 * @param cursor - The cursor string from URL parameters (can be empty string or undefined)
 * @param limit - The number of items to fetch
 * @param direction - The pagination direction ('forward' or 'backward')
 * @returns Object with actualCursor, sortOrder, and takeAmount for Prisma queries
 */
export function getCursorPaginationInformation(
	cursor: string | undefined,
	limit: number,
	direction: Direction = 'forward'
): {
	actualCursor: string | undefined;
	sortOrder: Prisma.SortOrder;
	takeAmount: number;
} {
	// Convert empty string cursor to undefined for Prisma compatibility
	const actualCursor = cursor && cursor !== '' ? cursor : undefined;

	// Determine sort order based on direction
	const sortOrder: Prisma.SortOrder = direction === 'backward' ? 'asc' : 'desc';

	// Determine take amount (always positive for Prisma)
	const takeAmount = limit + 1;

	return {
		actualCursor,
		sortOrder,
		takeAmount,
	};
}
