import { MILLISECONDS_PER_DAY } from '~/constants/time-constants';
import { VanState } from '~/generated/prisma/enums';
import type { VanModel } from '~/generated/prisma/models';

/**
 * @abstract calculates the cost of the rental, factoring in van sale discounts
 * @param rentedAt the date the rental began
 * @param rentedTo the date the rental ended
 * @param vanOrPrice the van object containing price, state, and discount information, or just the price number for backward compatibility
 * @returns {number} the total cost of the rental with any applicable discounts
 */
export function getCost(rentedAt: Date, rentedTo: Date, van: VanModel): number {
	const daysDifferent = Math.ceil(
		(rentedTo.getTime() - rentedAt.getTime()) / MILLISECONDS_PER_DAY
	);

	const basePrice = van.price;

	// Apply discount if van is on sale
	if (van.state === VanState.ON_SALE && van.discount && van.discount > 0) {
		const PercentageDivisor = 100;
		const discountAmount = (basePrice * van.discount) / PercentageDivisor;
		const discountedPrice = basePrice - discountAmount;
		return discountedPrice * daysDifferent;
	}

	return basePrice * daysDifferent;
}
