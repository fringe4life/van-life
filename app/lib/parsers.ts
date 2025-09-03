import { parseAsNumberLiteral, parseAsString, parseAsStringEnum } from 'nuqs';
import {
	DEFAULT_CURSOR,
	DEFAULT_DIRECTION,
	DEFAULT_FILTER,
	DEFAULT_LIMIT,
	DIRECTIONS,
	LIMITS,
} from '~/constants/constants';
import type { Direction, VanTypeOrEmpty } from '~/types/types';

// Hardcoded van types for client-side safety
const VAN_TYPE_LOWERCASE: VanTypeOrEmpty[] = ['simple', 'rugged', 'luxury'];

// Custom parser for type that handles lowercase values
const parseAsVanType =
	parseAsStringEnum(VAN_TYPE_LOWERCASE).withDefault(DEFAULT_FILTER);

// Custom parser for limit that validates against allowed numeric values
const parseAsLimit = parseAsNumberLiteral(LIMITS).withDefault(DEFAULT_LIMIT);

// Host routes only need cursor and limit (no type filter)
export const hostPaginationParsers = {
	cursor: parseAsString.withDefault(DEFAULT_CURSOR),
	limit: parseAsLimit,
	direction:
		parseAsStringEnum<Direction>(DIRECTIONS).withDefault(DEFAULT_DIRECTION),
};

// Main routes need cursor, limit, and type filter
export const paginationParsers = {
	...hostPaginationParsers,
	type: parseAsVanType,
};
