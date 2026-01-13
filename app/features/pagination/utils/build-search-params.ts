import { createSerializer } from 'nuqs/server';
import { validateLimit } from '~/features/pagination/utils/validators';
import {
	paginationParsers,
	searchParser,
	vanFiltersParser,
} from '~/lib/parsers';
import type { Maybe } from '~/types';

// Create combined serializer for all van route params
const combinedVanParsers = {
	...paginationParsers,
	...vanFiltersParser,
	...searchParser,
};
const serializeVanParams = createSerializer(combinedVanParsers);

/**
 * Builds search parameters string for van routes with pagination, filter, and search params
 * @param params - Object containing cursor, limit, optional types, excludeInRepair, onlyOnSale, search, and optional baseUrl
 * @returns If baseUrl is provided: full URL with query string (or just baseUrl if no params). Otherwise: query string (without '?' prefix) or empty string if no params
 */
export const buildVanSearchParams = (params: {
	cursor: string;
	limit: number;
	types?: Maybe<string[]>;
	excludeInRepair?: Maybe<boolean>;
	onlyOnSale?: Maybe<boolean>;
	search?: Maybe<string>;
	baseUrl?: Maybe<string>;
}): string => {
	const { cursor, limit, types, excludeInRepair, onlyOnSale, search, baseUrl } =
		params;

	// Build search params with validated limit (nuqs will clear on default)
	const searchParams: Record<string, string | number | string[] | boolean> = {
		cursor,
		limit: validateLimit(limit),
	};

	// Add filter params only if they have values (nuqs will handle defaults)
	if (types && types.length > 0) {
		searchParams.types = types;
	}

	if (excludeInRepair === true) {
		searchParams.excludeInRepair = true;
	}

	if (onlyOnSale === true) {
		searchParams.onlyOnSale = true;
	}

	if (search && search.trim() !== '') {
		searchParams.search = search.trim();
	}

	// Serialize and normalize: strip leading '?' if present
	const queryString = serializeVanParams(searchParams);
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
