export function getDiscountedPrice(
	price: number,
	discount?: number | null
): number {
	const MAX_DISCOUNT_PERCENTAGE = 50;
	const d =
		typeof discount === 'number'
			? Math.max(0, Math.min(MAX_DISCOUNT_PERCENTAGE, discount))
			: 0;
	return Math.round(price * (1 - d / MAX_DISCOUNT_PERCENTAGE));
}
