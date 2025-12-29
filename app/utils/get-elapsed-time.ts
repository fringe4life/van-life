import { differenceInDays, formatDistanceToNow } from 'date-fns';
import type { List, Maybe } from '~/types/types';

const NO_ELAPSED_TIME = {
	elapsedDays: 0,
	description: 'No data yet',
} as const;

/**
 * Calculates the elapsed time between the first and last rental/transaction
 * @param items Array of objects with either rentedAt or createdAt dates
 * @returns Object with elapsed days and human-readable description
 */
export const getElapsedTime = (
	items: List<{ rentedAt?: Maybe<Date>; createdAt?: Date }>
) => {
	if (!items || items.length === 0) {
		return NO_ELAPSED_TIME;
	}

	// Sort items by date to get first and last
	const sortedItems = [...items].sort((a, b) => {
		const dateA = a.rentedAt ?? a.createdAt;
		const dateB = b.rentedAt ?? b.createdAt;
		if (!(dateA && dateB)) {
			return 0;
		}
		return dateA.getTime() - dateB.getTime();
	});

	const firstItem = sortedItems[0];
	const lastItem = sortedItems.at(-1);

	const firstDate = firstItem?.rentedAt ?? firstItem?.createdAt;
	const lastDate = lastItem?.rentedAt ?? lastItem?.createdAt;

	if (!(lastDate && firstDate)) {
		return {
			elapsedDays: 0,
			description: 'No data yet',
			firstRental: firstDate,
			lastRental: firstDate,
		};
	}

	// Calculate days between first and last
	const elapsedDays = differenceInDays(lastDate, firstDate) + 1;

	// Get human-readable description
	const description = formatDistanceToNow(firstDate, {
		addSuffix: true,
	});

	return {
		elapsedDays,
		description,
		firstRental: firstDate,
		lastRental: lastDate,
	};
};
