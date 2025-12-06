import { INVALID_ID_ERROR } from '~/constants/constants';
import { isCUID } from '~/utils/check-is-cuid.server';

type CuidParamIndex<Args extends readonly unknown[]> = Extract<
	keyof Args,
	number
>;

/**
 * Wrap an async function and validate selected positional arguments as CUIDs
 * before executing it. If any selected argument fails validation, the wrapped
 * function throws `INVALID_ID_ERROR` and never calls the inner function.
 * This allows `tryCatch` to handle the error consistently with other errors.
 *
 * @example
 * // Single CUID argument at index 0 - inline usage
 * const result = await tryCatch(() =>
 *   validateCUIDS(getUser, [0] as const)(session.user.id)
 * );
 * if (result.error) {
 *   // Handle error (could be INVALID_ID_ERROR or other error)
 * }
 *
 * @example
 * // Multiple CUID arguments at indices 0 and 2
 * const result = await tryCatch(() =>
 *   validateCUIDS(getRental, [0, 2] as const)(rentId, 10, hostId)
 * );
 *
 * @example
 * // With object-based functions, create a wrapper
 * const result = await tryCatch(() => {
 *   const getWithUserId = async (userId: string) =>
 *     getHostReviewsPaginated({ userId, cursor, limit, direction, sort });
 *   return validateCUIDS(getWithUserId, [0] as const)(session.user.id);
 * });
 */
export function validateCUIDS<Args extends readonly unknown[], R>(
	fn: (...args: Args) => Promise<R>,
	indices: readonly CuidParamIndex<Args>[]
) {
	return async (...args: Args): Promise<R> => {
		for (const index of indices) {
			const value = args[index];
			if (typeof value !== 'string' || !isCUID(value)) {
				throw INVALID_ID_ERROR;
			}
		}

		return await fn(...args);
	};
}
