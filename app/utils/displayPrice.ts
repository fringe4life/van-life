const formatter = new Intl.NumberFormat('en-us', {
	style: 'currency',
	currency: 'USD',
});

/**
 * @abstract used to display price information to visitors
 * @param price the price of the item
 * @returns a string representation to be shown to users
 */
export function displayPrice(price: number | string | null): string {
	if (!price || typeof price === 'string') return '$0.00';

	return formatter.format(price);
}
