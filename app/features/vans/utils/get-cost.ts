import { MILLISECONDS_PER_DAY } from '~/constants/time-constants';
import type { VanModel } from '~/generated/prisma/models';

/**
 * @abstract calculates the cost of the rental, factoring in van sale discounts
 * @param rentedAt the date the rental began
 * @param rentedTo the date the rental ended
 * @param vanOrPrice the van object containing price, state, and discount information, or just the price number for backward compatibility
 * @returns {number} the total cost of the rental with any applicable discounts
 */
export function getCost(
	rentedAt: Date,
	rentedTo: Date,
	vanOrPrice: VanModel | number
): number {
	const daysDifferent = Math.ceil(
		(rentedTo.getTime() - rentedAt.getTime()) / MILLISECONDS_PER_DAY
	);

	// Handle legacy number parameter for backward compatibility
	if (typeof vanOrPrice === 'number') {
		return vanOrPrice * daysDifferent;
	}

	// Handle van object with discount calculation
	const van = vanOrPrice;
	const basePrice = van.price;

	// Apply discount if van is on sale
	if (van.state === 'ON_SALE' && van.discount && van.discount > 0) {
		const PERCENTAGE_DIVISOR = 100;
		const discountAmount = (basePrice * van.discount) / PERCENTAGE_DIVISOR;
		const discountedPrice = basePrice - discountAmount;
		return discountedPrice * daysDifferent;
	}

	return basePrice * daysDifferent;
}
