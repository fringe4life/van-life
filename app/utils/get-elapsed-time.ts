import { differenceInDays, formatDistanceToNow } from 'date-fns';
import type { List, Maybe } from '~/types';

const NO_ELAPSED_TIME = {
	elapsedDays: 0,
	description: 'No data yet',
} as const;

interface ElapsedTime {
	createdAt?: Date;
	rentedAt?: Maybe<Date>;
}

function getItemDate(item: ElapsedTime): Date | undefined {
	return item.rentedAt ?? item.createdAt ?? undefined;
}

/**
 * Calculates the elapsed time between the first and last rental/transaction
 * @param items Array of objects with either rentedAt or createdAt dates
 * @returns Object with elapsed days and human-readable description
 */
export const getElapsedTime = (items: List<ElapsedTime>) => {
	const dates = (items ?? [])
		.map(getItemDate)
		.filter((date): date is Date => date != null);

	if (dates.length === 0) {
		return NO_ELAPSED_TIME;
	}

	const timestamps = dates.map((date) => date.getTime());
	const firstDate = new Date(Math.min(...timestamps));
	const lastDate = new Date(Math.max(...timestamps));

	return {
		elapsedDays: differenceInDays(lastDate, firstDate) + 1,
		description: formatDistanceToNow(firstDate, { addSuffix: true }),
	};
};
