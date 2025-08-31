import { parseAsInteger, parseAsStringEnum } from 'nuqs';
import {
	DEFAULT_FILTER,
	DEFAULT_LIMIT,
	DEFAULT_PAGE,
} from '~/constants/constants';
import type { VanTypeOrEmpty } from '~/types/types';

// Hardcoded van types for client-side safety
const VAN_TYPE_LOWERCASE: VanTypeOrEmpty[] = ['simple', 'rugged', 'luxury'];

// Custom parser for type that handles lowercase values
const parseAsVanType =
	parseAsStringEnum(VAN_TYPE_LOWERCASE).withDefault(DEFAULT_FILTER);

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
