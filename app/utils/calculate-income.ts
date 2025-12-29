import type { Amount, List } from '~/types/types';

const NO_INCOME = 0 as const;

/**
 * @abstract Calculates total income from rental items
 * @param items Array of objects that have an amount property
 * @returns Total income amount
 */
export const calculateTotalIncome = <T extends Amount>(items: List<T>) => {
	if (!items || items.length === 0) {
		return NO_INCOME;
	}

	return items.reduce((total, item) => total + item.amount, 0);
};
