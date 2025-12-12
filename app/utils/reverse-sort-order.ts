import type { Direction, SortOption } from '~/features/pagination/types';

/**
 * Reverses the sort option for backward pagination
 * When going backward, we need to query in reverse order, then reverse results
 */
export const reverseSortOption = (
	sort: SortOption,
	direction: Direction
): SortOption => {
	if (direction === 'forward') {
		return sort;
	}
	switch (sort) {
		case 'newest':
			return 'oldest';
		case 'oldest':
			return 'newest';
		case 'highest':
			return 'lowest';
		case 'lowest':
			return 'highest';
		default:
			return sort;
	}
};
