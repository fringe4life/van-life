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

// Host routes need cursor, limit, direction, and sort (no type filter)
export const hostPaginationParsers = {
	cursor: parseAsString.withDefault(DEFAULT_CURSOR),
	limit: parseAsLimit,
	direction:
		parseAsStringEnum<Direction>(DIRECTIONS).withDefault(DEFAULT_DIRECTION),
	sort: parseAsSortOption,
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

// Money page needs returnTo parameter for redirect after transaction
export const moneyParsers = {
	returnTo: parseAsString.withDefault(''),
};

// Van filters for advanced filtering (multiple types, state filters)
export const vanFiltersParser = {
	types: parseAsArrayOf(parseAsStringEnum([...VAN_TYPE_LOWERCASE])).withDefault(
		[]
	),
	excludeInRepair: parseAsBoolean.withDefault(false),
	onlyOnSale: parseAsBoolean.withDefault(false),
};
