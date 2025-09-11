export function getDiscountedPrice(
	price: number,
	discount?: number | null,
): number {
	const d =
		typeof discount === 'number' ? Math.max(0, Math.min(100, discount)) : 0;
	return Math.round(price * (1 - d / 100));
}
