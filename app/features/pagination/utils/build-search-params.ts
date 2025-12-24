import { createSerializer } from 'nuqs/server';
import { validateLimit } from '~/features/pagination/utils/validators';
import { validateVanTypeOrEmpty } from '~/features/vans/utils/validators';
import { paginationParsers } from '~/lib/parsers';
import type { Maybe } from '~/types/types';

// Create serializers for different use cases
const serializePaginationParams = createSerializer(paginationParsers);

/**
 * Builds search parameters string for van routes with optional type and van filters
 * @param params - Object containing cursor, limit, optional type, optional vanFilter, and optional baseUrl
 * @returns If baseUrl is provided: full URL with query string (or just baseUrl if no params). Otherwise: query string (without '?' prefix) or empty string if no params
 */
export const buildVanSearchParams = (params: {
	cursor: string;
	limit: number;
	type?: Maybe<string>;
	vanFilter?: Maybe<string>;
	baseUrl?: Maybe<string>;
}): string => {
	const { cursor, limit, type, vanFilter, baseUrl } = params;

	// Build search params with validated limit and type (nuqs will clear on default)
	const searchParams: Record<string, string | number> = {
		cursor,
		limit: validateLimit(limit),
	};

	// Only add type if it's a valid van type, otherwise let nuqs handle the default
	const validatedType = validateVanTypeOrEmpty(type);
	if (validatedType !== '') {
		searchParams.type = validatedType;
	}

	// Add vanFilter if it's a valid filter
	if (vanFilter && (vanFilter === 'sale' || vanFilter === 'new')) {
		searchParams.vanFilter = vanFilter;
	}

	// Serialize and normalize: strip leading '?' if present
	const queryString = serializePaginationParams(searchParams);
	const normalizedQuery = queryString.startsWith('?')
		? queryString.slice(1)
		: queryString;

	// If baseUrl is provided, return full URL with query string
	if (baseUrl) {
		return normalizedQuery ? `${baseUrl}?${normalizedQuery}` : baseUrl;
	}

	// Otherwise, return just the query string (backward compatible)
	return normalizedQuery;
};
