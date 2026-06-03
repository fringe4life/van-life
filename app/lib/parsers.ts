import {
	parseAsArrayOf,
	parseAsBoolean,
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
} from '~/features/pagination/pagination-constants';
import type { Direction, SortOption } from '~/features/pagination/types';
import { VAN_TYPE_LOWERCASE } from '~/features/vans/constants/van-types';

// Custom parser for type that handles lowercase values
const parseAsVanType = parseAsStringEnum([
	...VAN_TYPE_LOWERCASE,
	'',
]).withDefault(DEFAULT_FILTER);

// Custom parser for limit that validates against allowed numeric values
const parseAsLimit = parseAsNumberLiteral(LIMITS).withDefault(DEFAULT_LIMIT);

export const searchParser = { search: parseAsString.withDefault('') };

// Custom parser for sort options
const parseAsSortOption = parseAsStringEnum<SortOption>([
	...SORT_OPTIONS,
]).withDefault(DEFAULT_SORT);

const PAGINATION_PARSERS = {
	cursor: parseAsString.withDefault(DEFAULT_CURSOR),
	direction:
		parseAsStringEnum<Direction>(DIRECTIONS).withDefault(DEFAULT_DIRECTION),
};

// Host routes need cursor, limit, direction, and sort (no type filter)
export const hostPaginationParsers = {
	...PAGINATION_PARSERS,
	limit: parseAsLimit,
	sort: parseAsSortOption,
};

// Search input: search + pagination reset in one nuqs setter
export const searchUrlParsers = {
	...searchParser,
	...PAGINATION_PARSERS,
};

// Van filters for the main vans page (sale, new)
const VAN_FILTERS = ['sale', 'new', ''] as const;

const parseAsVanFilter = parseAsStringEnum([...VAN_FILTERS]).withDefault('');

// Main routes need cursor, limit, type filter, and van filter
export const paginationParsers = {
	...hostPaginationParsers,
	type: parseAsVanType,
	vanFilter: parseAsVanFilter,
};

// Van filters for advanced filtering (multiple types, state filters)
export const vanFiltersParser = {
	types: parseAsArrayOf(parseAsStringEnum([...VAN_TYPE_LOWERCASE])).withDefault(
		[]
	),
	excludeInRepair: parseAsBoolean.withDefault(false),
	onlyOnSale: parseAsBoolean.withDefault(false),
};

// Vans filter UI: filters + pagination reset in one nuqs setter
export const vansFilterUrlParsers = {
	...vanFiltersParser,
	...PAGINATION_PARSERS,
};
