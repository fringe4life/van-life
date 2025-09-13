import {
	parseAsJson,
	parseAsNumberLiteral,
	parseAsString,
	parseAsStringEnum,
} from 'nuqs';
import {
	DEFAULT_CURSOR,
	DEFAULT_DIRECTION,
	DEFAULT_FILTER,
	DEFAULT_LIMIT,
	DEFAULT_SORT,
	DIRECTIONS,
	LIMITS,
	SORT_OPTIONS,
} from '~/constants/paginationConstants';
import { cursorPaginationZodSchema } from '~/lib/paginationZodSchema.client';
import type { Direction, SortOption, VanTypeOrEmpty } from '~/types/types';

// Hardcoded van types for client-side safety
const VAN_TYPE_LOWERCASE: VanTypeOrEmpty[] = ['simple', 'rugged', 'luxury'];

// Custom parser for type that handles lowercase values
const parseAsVanType =
	parseAsStringEnum(VAN_TYPE_LOWERCASE).withDefault(DEFAULT_FILTER);

// Custom parser for limit that validates against allowed numeric values
const parseAsLimit = parseAsNumberLiteral(LIMITS).withDefault(DEFAULT_LIMIT);

// Custom parser for sort options
const parseAsSortOption = parseAsStringEnum<SortOption>([
	...SORT_OPTIONS,
]).withDefault(DEFAULT_SORT);

// Zod-based parser for complete pagination state
export const paginationZodParser = parseAsJson(cursorPaginationZodSchema);

// Host routes need cursor, limit, direction, and sort (no type filter)
export const hostPaginationParsers = {
	cursor: parseAsString.withDefault(DEFAULT_CURSOR),
	limit: parseAsLimit,
	direction:
		parseAsStringEnum<Direction>(DIRECTIONS).withDefault(DEFAULT_DIRECTION),
	sort: parseAsSortOption,
};

// Main routes need cursor, limit, and type filter
export const paginationParsers = {
	...hostPaginationParsers,
	type: parseAsVanType,
};

// Money page needs returnTo parameter for redirect after transaction
export const moneyParsers = {
	returnTo: parseAsString.withDefault(''),
};
