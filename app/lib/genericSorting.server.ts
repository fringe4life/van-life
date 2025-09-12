import type { Prisma } from '~/generated/prisma/client';
import type { SortOption } from '~/types/types';

/**
 * Generic sorting configuration for different Prisma models
 * Maps sort options to Prisma orderBy configurations
 */
export type SortConfig<T extends Record<string, unknown>> = {
	/** Field to sort by for newest/oldest (usually createdAt) */
	dateField: keyof T;
	/** Field to sort by for highest/lowest (usually amount, rating, etc.) */
	valueField: keyof T;
	/** Optional secondary field for stable sorting */
	secondaryField?: keyof T;
};

/**
 * Creates a generic orderBy clause for any Prisma model based on sort option
 *
 * @param sort - The sort option (newest, oldest, highest, lowest)
 * @param config - Configuration object specifying which fields to use for sorting
 * @returns Prisma orderBy object
 *
 * @example
 * ```typescript
 * // For Review model
 * const reviewOrderBy = createGenericOrderBy<Prisma.ReviewOrderByWithRelationInput>(
 *   'highest',
 *   { dateField: 'createdAt', valueField: 'rating' }
 * );
 *
 * // For Transaction model
 * const transactionOrderBy = createGenericOrderBy<Prisma.TransactionOrderByWithRelationInput>(
 *   'newest',
 *   { dateField: 'createdAt', valueField: 'amount' }
 * );
 * ```
 */
export function createGenericOrderBy<T extends Record<string, unknown>>(
	sort: SortOption,
	config: SortConfig<T>
): T {
	const { dateField, valueField } = config;

	// biome-ignore lint/nursery/noUnnecessaryConditions: simply related to switch statement
	switch (sort) {
		case 'oldest':
			return { [dateField]: 'asc' } as T;
		case 'highest':
			return { [valueField]: 'desc' } as T;
		case 'lowest':
			return { [valueField]: 'asc' } as T;
		default:
			return { [dateField]: 'desc' } as T;
	}
}

/**
 * Type-safe helper to create sort configurations for common model patterns
 */
export const createSortConfig = <T extends Record<string, unknown>>(
	config: SortConfig<T>
) => config;

/**
 * Common sort configurations for different models
 */
export const COMMON_SORT_CONFIGS = {
	/** Configuration for models with createdAt and rating fields */
	review: createSortConfig<Prisma.ReviewOrderByWithRelationInput>({
		dateField: 'createdAt',
		valueField: 'rating',
	}),

	/** Configuration for models with createdAt and amount fields */
	transaction: createSortConfig<Prisma.TransactionOrderByWithRelationInput>({
		dateField: 'createdAt',
		valueField: 'amount',
	}),

	/** Configuration for models with createdAt and price fields */
	van: createSortConfig<Prisma.VanOrderByWithRelationInput>({
		dateField: 'createdAt',
		valueField: 'price',
	}),
} as const;
