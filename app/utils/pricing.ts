import type { Maybe } from '~/types/types';

export const MAX_DISCOUNT_PERCENTAGE = 50;
const PERCENTAGE_DIVISOR = 100;

export const getDiscountedPrice = (
	price: number,
	discount: Maybe<number> = 0
): number => {
	const finalDiscount = Math.max(
		0,
		Math.min(MAX_DISCOUNT_PERCENTAGE, discount ?? 0)
	);

	return Math.round(price * (1 - finalDiscount / PERCENTAGE_DIVISOR));
};
