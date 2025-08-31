import { differenceInDays, formatDistanceToNow } from 'date-fns';

/**
 * Calculates the elapsed time between the first and last rental
 * @param rentals Array of rental objects with rentedAt dates
 * @returns Object with elapsed days and human-readable description
 */
export function getElapsedTime(rentals: Array<{ rentedAt: Date }>) {
	if (!rentals || rentals.length === 0) {
		return {
			elapsedDays: 0,
			description: 'No rentals yet',
		};
	}

	// Sort rentals by date to get first and last
	const sortedRentals = [...rentals].sort(
		(a, b) => a.rentedAt.getTime() - b.rentedAt.getTime(),
	);

	const firstRental = sortedRentals[0];
	const lastRental = sortedRentals[sortedRentals.length - 1];

	// Calculate days between first and last rental
	const elapsedDays =
		differenceInDays(lastRental.rentedAt, firstRental.rentedAt) + 1;

	// Get human-readable description
	const description = formatDistanceToNow(firstRental.rentedAt, {
		addSuffix: true,
	});

	return {
		elapsedDays,
		description,
		firstRental: firstRental.rentedAt,
		lastRental: lastRental.rentedAt,
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
		0,
	);
}
