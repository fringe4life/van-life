import { init } from '@paralleldrive/cuid2';

/**
 * Custom CUID v2 generator configured for 25 characters.
 * This matches the length of Prisma's default cuid() (CUID v1) for optimal database storage.
 *
 * @example
 * ```ts
 * const id = createId(); // "cl8qj639w000l7n6e6p689uadx" (25 chars)
 * ```
 */
export const createId = init({
	length: 25,
});
