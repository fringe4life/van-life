import type { Direction, PaginationProps } from '~/features/pagination/types';
import type { Maybe } from '~/types/types';

/**
 * Generic pagination utility that processes database results and returns
 * the actual items with pagination metadata.
 *
 * @param items - The items from database query (can be T[], string for errors, or number for counts)
 * @param limit - The limit used for pagination
 * @param cursor - The cursor used for pagination (for hasPreviousPage calculation)
 * @param direction - The pagination direction ('forward' or 'backward')
 * @returns Object with items, hasNextPage, and hasPreviousPage
 */
export function toPagination<T>(
	items: Maybe<T[]>,
	limit: number,
	cursor: Maybe<string>,
	direction: Direction = 'forward'
): PaginationProps<T> {
	// If items is null, return as-is with no pagination
	if (!items) {
		return {
			items,
			hasNextPage: false,
			hasPreviousPage: false,
		};
	}

	// Check if there are more results (cursor pagination)
	const hasMoreResults = items.length > limit;

	// FIXED: Correct pagination logic based on Prisma documentation
	// For forward pagination: hasNextPage = hasMoreResults, hasPreviousPage = has cursor
	// For backward pagination: hasNextPage = has cursor, hasPreviousPage = hasMoreResults
	const hasNextPage =
		direction === 'forward' ? hasMoreResults : Boolean(cursor);
	const hasPreviousPage =
		direction === 'forward' ? Boolean(cursor) : hasMoreResults;

	// Remove the extra item if we took one more than the limit
	let actualItems = hasMoreResults ? items.slice(0, limit) : items;

	// For backward pagination, reverse the results since Prisma returns them in opposite order
	if (direction === 'backward') {
		actualItems = actualItems.reverse();
	}

	return {
		items: actualItems,
		hasNextPage,
		hasPreviousPage,
	};
}
