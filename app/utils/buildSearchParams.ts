import { createSerializer } from 'nuqs/server';
import { hostPaginationParsers, paginationParsers } from '~/lib/parsers';
import { validateLimit, validateVanTypeOrEmpty } from './validators';

// Create serializers for different use cases
const serializePaginationParams = createSerializer(paginationParsers);
const serializeHostPaginationParams = createSerializer(hostPaginationParsers);

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
	const validatedType = validateVanTypeOrEmpty(type || '');
	if (validatedType !== '') {
		searchParams.type = validatedType;
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
	if (includeType) {
		const validatedType = validateVanTypeOrEmpty(params.type || '');
		if (validatedType !== '') {
			searchParams.type = validatedType;
		}
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
