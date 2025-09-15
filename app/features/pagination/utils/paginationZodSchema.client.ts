import { z } from 'zod/mini';
import {
	DEFAULT_CURSOR,
	DEFAULT_DIRECTION,
	DEFAULT_FILTER,
	DEFAULT_LIMIT,
	DIRECTIONS,
} from '~/features/pagination/paginationConstants';

/**
 * Zod Mini schema for cursor-based pagination parameters
 * This is client-safe and can be used with nuqs parseAsJson
 * Using Zod Mini for ~64% smaller bundle size
 */
export const cursorPaginationZodSchema = z.object({
	limit: z._default(z.number().check(z.positive()), DEFAULT_LIMIT),
	cursor: z._default(z.optional(z.string()), DEFAULT_CURSOR),
	direction: z._default(z.enum(DIRECTIONS), DEFAULT_DIRECTION),
	type: z._default(z.optional(z.string()), DEFAULT_FILTER),
});
