export function getCost(rentedAt: Date, rentedTo: Date, price: number) {
	const daysDifferent = Math.ceil(
		(rentedTo.getTime() - rentedAt.getTime()) / (1000 * 3600 * 24),
	);
	return price * daysDifferent;
}
