import { type } from 'arktype';
import {
	DEFAULT_CURSOR,
	DEFAULT_DIRECTION,
	DEFAULT_FILTER,
	DEFAULT_LIMIT,
	DIRECTIONS,
} from '~/features/pagination/pagination-constants';

/**
 * ArkType schema for cursor-based pagination parameters
 * This is client-safe and can be used with nuqs parseAsJson
 * Using ArkType for better performance and smaller bundle size
 */
export const cursorPaginationSchema = type({
	limit: 'number > 0',
	'cursor?': 'string',
	direction: `"${DIRECTIONS.join('" | "')}"`,
	'type?': 'string',
}).pipe((data) => {
	// Apply defaults
	return {
		limit: data.limit ?? DEFAULT_LIMIT,
		cursor: data.cursor ?? DEFAULT_CURSOR,
		direction: data.direction ?? DEFAULT_DIRECTION,
		type: data.type ?? DEFAULT_FILTER,
	};
});
