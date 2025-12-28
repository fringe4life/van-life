import type {
	BasePaginationParams,
	CursorMetadata,
} from '~/features/pagination/types';
import type { Prisma } from '~/generated/prisma/client';

/**
 * Generalized cursor pagination utility that provides all necessary information
 * for Prisma cursor-based pagination queries.
 *
 * @param cursor - The cursor string from URL parameters (can be empty string or undefined)
 * @param limit - The number of items to fetch
 * @param direction - The pagination direction ('forward' or 'backward')
 * @returns Object with actualCursor, sortOrder, and takeAmount for Prisma queries
 */
export const getCursorMetadata = ({
	cursor,
	limit,
	direction = 'forward',
}: BasePaginationParams): CursorMetadata => {
	// Convert empty string cursor to undefined for Prisma compatibility
	const normalisedCursor = cursor && cursor !== '' ? cursor : undefined;

	// Determine sort order based on direction
	const sortOrder: Prisma.SortOrder = direction === 'backward' ? 'asc' : 'desc';

	// Determine take amount (always positive for Prisma)
	const take = limit + 1;

	const skip = normalisedCursor ? 1 : 0;

	const actualCursor = normalisedCursor ? { id: normalisedCursor } : undefined;

	return {
		actualCursor,
		sortOrder,
		take,
		skip,
	} satisfies CursorMetadata;
};
