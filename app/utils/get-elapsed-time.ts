import { differenceInDays, formatDistanceToNow } from 'date-fns';

/**
 * Calculates the elapsed time between the first and last rental/transaction
 * @param items Array of objects with either rentedAt or createdAt dates
 * @returns Object with elapsed days and human-readable description
 */
export function getElapsedTime(
	items: Array<{ rentedAt?: Date; createdAt?: Date }>
) {
	if (!items || items.length === 0) {
		return {
			elapsedDays: 0,
			description: 'No data yet',
		};
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
}

/**
 * Calculates total income from rental transactions
 * @param transactions Array of transaction objects with amount
 * @returns Total income amount
 */
export function calculateTotalIncome(transactions: Array<{ amount: number }>) {
	if (!transactions || transactions.length === 0) {
		return 0;
	}

	return transactions.reduce(
		(total, transaction) => total + transaction.amount,
		0
	);
}
