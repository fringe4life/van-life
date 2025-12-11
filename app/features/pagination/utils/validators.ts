// ============================================================================
// PAGINATION VALIDATORS
// ============================================================================

import {
	DEFAULT_CURSOR,
	DEFAULT_DIRECTION,
	DEFAULT_LIMIT,
	DEFAULT_SORT,
	DIRECTIONS,
	LIMITS,
	SORT_OPTIONS,
} from '~/features/pagination/pagination-constants';
import type { Direction, SortOption } from '~/features/pagination/types';

/**
 * Type guard to check if a number is a valid limit value
 * @param value - The value to check
 * @returns True if the value is in the LIMITS array, false otherwise
 */
export function isValidLimit(value: number): value is (typeof LIMITS)[number] {
	return LIMITS.includes(value as (typeof LIMITS)[number]);
}

/**
 * Validates and returns a valid limit value, defaulting to DEFAULT_LIMIT if invalid
 * @param limit - The limit value to validate
 * @returns A valid limit value from the LIMITS array
 */
export function validateLimit(limit: number): (typeof LIMITS)[number] {
	return isValidLimit(limit) ? limit : DEFAULT_LIMIT;
}

/**
 * Type guard to check if a string is a valid direction
 * @param value - The value to check
 * @returns True if the value is a valid direction, false otherwise
 */
export function isValidDirection(value: string): value is Direction {
	return DIRECTIONS.includes(value as Direction);
}

/**
 * Validates and returns a valid direction, defaulting to DEFAULT_DIRECTION if invalid
 * @param direction - The direction value to validate
 * @returns A valid direction
 */
export function validateDirection(direction: string): Direction {
	return isValidDirection(direction) ? direction : DEFAULT_DIRECTION;
}

/**
 * Type guard to check if a string is a valid sort option
 * @param value - The value to check
 * @returns True if the value is a valid sort option, false otherwise
 */
export function isValidSortOption(value: string): value is SortOption {
	return SORT_OPTIONS.includes(value as SortOption);
}

/**
 * Validates and returns a valid sort option, defaulting to DEFAULT_SORT if invalid
 * @param sort - The sort value to validate
 * @returns A valid sort option
 */
export function validateSortOption(sort: string): SortOption {
	return isValidSortOption(sort) ? sort : DEFAULT_SORT;
}

// ============================================================================
// CURSOR VALIDATORS
// ============================================================================

/**
 * Type guard to check if a string is a valid cursor (non-empty string)
 * @param value - The value to check
 * @returns True if the value is a valid cursor, false otherwise
 */
export function isValidCursor(value: string): boolean {
	return value !== '' && value !== null && value !== undefined;
}

/**
 * Validates and returns a valid cursor, defaulting to DEFAULT_CURSOR if invalid
 * @param cursor - The cursor value to validate
 * @returns A valid cursor
 */
export function validateCursor(cursor: string): string {
	return isValidCursor(cursor) ? cursor : DEFAULT_CURSOR;
}
