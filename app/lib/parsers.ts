import { parseAsInteger, parseAsStringEnum } from 'nuqs';
import {
	DEFAULT_FILTER,
	DEFAULT_LIMIT,
	DEFAULT_PAGE,
} from '~/constants/constants';
import type { VanTypeOrEmpty } from '~/types/types';
import { VAN_TYPE_LOWERCASE } from '~/types/types.server';

// Custom parser for type that handles lowercase values
const parseAsVanType = parseAsStringEnum(
	VAN_TYPE_LOWERCASE as VanTypeOrEmpty[],
).withDefault(DEFAULT_FILTER);

// Host routes only need page and limit (no type filter)
export const hostPaginationParsers = {
	page: parseAsInteger.withDefault(DEFAULT_PAGE),
	limit: parseAsInteger.withDefault(DEFAULT_LIMIT),
};

// Main routes need page, limit, and type filter
export const paginationParsers = {
	page: parseAsInteger.withDefault(DEFAULT_PAGE),
	limit: parseAsInteger.withDefault(DEFAULT_LIMIT),
	type: parseAsVanType,
};

// Legacy export for backward compatibility
export const PaginationParams = paginationParsers;
