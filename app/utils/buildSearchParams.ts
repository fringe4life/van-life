import { createSerializer } from 'nuqs/server';
import {
	DEFAULT_FILTER,
	DEFAULT_LIMIT,
	LIMITS,
} from '~/constants/paginationConstants';
import { hostPaginationParsers, paginationParsers } from '~/lib/parsers';

// Create serializers for different use cases
const serializePaginationParams = createSerializer(paginationParsers);
const serializeHostPaginationParams = createSerializer(hostPaginationParsers);

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
 * Builds search parameters string for van routes with optional type filter
 * @param params - Object containing cursor, limit, and optional type
 * @returns Query string starting with '?' or empty string if no params
 */
export function buildVanSearchParams(params: {
	cursor: string;
	limit: number;
	type?: string | null;
}): string {
	const { cursor, limit, type } = params;

	// Build search params with validated limit and type (nuqs will clear on default)
	const searchParams: Record<string, string | number> = {
		cursor,
		limit: validateLimit(limit),
	};

	// Only add type if it's a valid van type, otherwise let nuqs handle the default
	if (type && type !== '' && type !== DEFAULT_FILTER) {
		searchParams.type = type;
	}

	const queryString = serializePaginationParams(searchParams);
	return queryString ? `?${queryString}` : '';
}

/**
 * Builds search parameters string for host routes (no type filter)
 * @param params - Object containing cursor and limit
 * @returns Query string starting with '?' or empty string if no params
 */
export function buildHostSearchParams(params: {
	cursor: string;
	limit: number;
}): string {
	const { cursor, limit } = params;

	const searchParams = {
		cursor,
		limit: validateLimit(limit),
	};

	const queryString = serializeHostPaginationParams(searchParams);
	return queryString ? `?${queryString}` : '';
}

/**
 * Generic function to build search parameters with any subset of pagination params
 * @param params - Object containing any combination of cursor, limit, type, direction, sort
 * @param includeType - Whether to include type parameter (default: true)
 * @returns Query string starting with '?' or empty string if no params
 */
export function buildSearchParams(
	params: {
		cursor?: string;
		limit?: number;
		type?: string | null;
		direction?: string;
		sort?: string;
	},
	includeType = true
): string {
	const searchParams: Record<string, string | number> = {};

	// Add cursor if provided
	if (params.cursor) {
		searchParams.cursor = params.cursor;
	}

	// Add limit if provided, with validation
	if (params.limit) {
		searchParams.limit = validateLimit(params.limit);
	}

	// Add type if includeType is true and it's a valid van type
	if (
		includeType &&
		params.type &&
		params.type !== '' &&
		params.type !== DEFAULT_FILTER
	) {
		searchParams.type = params.type;
	}

	// Add direction if provided
	if (params.direction) {
		searchParams.direction = params.direction;
	}

	// Add sort if provided
	if (params.sort) {
		searchParams.sort = params.sort;
	}

	// Use the appropriate serializer based on whether type is included
	const serializer = includeType
		? serializePaginationParams
		: serializeHostPaginationParams;
	const queryString = serializer(searchParams);

	return queryString ? `?${queryString}` : '';
}
