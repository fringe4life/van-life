/**
 * @abstract calculates the cost of the rental
 * @param rentedAt the date the rental began
 * @param rentedTo the date the rental ended
 * @param price pirce per day
 * @returns {number} the total cost of the rental
 */
export function getCost(rentedAt: Date, rentedTo: Date, price: number): number {
	const daysDifferent = Math.ceil(
		(rentedTo.getTime() - rentedAt.getTime()) / (1000 * 3600 * 24),
	);
	return price * daysDifferent;
}
