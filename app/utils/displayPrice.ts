const formatter = new Intl.NumberFormat('en-us', {
	style: 'currency',
	currency: 'USD',
});

/**
 * @abstract used to display price information to visitors
 * @param price the price of the item
 * @returns a string representation to be shown to users
 */
export function displayPrice(price: number): string {
	if (!price) return 'Still rented';

	return formatter.format(price);
}
