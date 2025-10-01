export function getDiscountedPrice(
	price: number,
	discount?: number | null
): number {
	const MaxDiscountPercentage = 50;
	const d =
		typeof discount === 'number'
			? Math.max(0, Math.min(MaxDiscountPercentage, discount))
			: 0;
	return Math.round(price * (1 - d / MaxDiscountPercentage));
}
