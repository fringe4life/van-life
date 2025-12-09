import type { Direction, Maybe } from '~/types/types';

/**
 * Generic pagination utility that processes database results and returns
 * the actual items with pagination metadata.
 *
 * @param items - The items from database query (can be T[], string for errors, or number for counts)
 * @param limit - The limit used for pagination
 * @param cursor - The cursor used for pagination (for hasPreviousPage calculation)
 * @param direction - The pagination direction ('forward' or 'backward')
 * @returns Object with actualItems, hasNextPage, and hasPreviousPage
 */
export function hasPagination<T>(
	items: Maybe<T[]>,
	limit: number,
	cursor: Maybe<string>,
	direction: Direction = 'forward'
): {
	actualItems: Maybe<T[]>;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
} {
	// If items is a string (error) or number (count), return as-is with no pagination
	if (items === null) {
		return {
			actualItems: null,
			hasNextPage: false,
			hasPreviousPage: false,
		};
	}

	// Check if there are more results (cursor pagination)
	const hasMoreResults = Array.isArray(items) && items.length > limit;

	// FIXED: Correct pagination logic based on Prisma documentation
	// For forward pagination: hasNextPage = hasMoreResults, hasPreviousPage = has cursor
	// For backward pagination: hasNextPage = has cursor, hasPreviousPage = hasMoreResults
	const hasNextPage =
		direction === 'forward' ? hasMoreResults : Boolean(cursor);
	const hasPreviousPage =
		direction === 'forward' ? Boolean(cursor) : hasMoreResults;

	// Remove the extra item if we took one more than the limit
	let actualItems =
		Array.isArray(items) && hasMoreResults ? items.slice(0, limit) : items;

	// For backward pagination, reverse the results since Prisma returns them in opposite order
	if (direction === 'backward' && Array.isArray(actualItems)) {
		actualItems = actualItems.reverse();
	}

	return {
		actualItems,
		hasNextPage,
		hasPreviousPage,
	};
}
