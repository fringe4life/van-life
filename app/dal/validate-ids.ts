import { INVALID_ID_ERROR } from '~/constants/constants';
import { isUUIDv7 } from '~/utils/check-is-uuidv7.server';

type IdParamIndex<Args extends readonly unknown[]> = Extract<
	keyof Args,
	number
>;

/**
 * Wrap an async function and validate selected positional arguments as UUID v7
 * before executing it. If any selected argument fails validation, the wrapped
 * function throws `INVALID_ID_ERROR` and never calls the inner function.
 */
export const validateIds =
	<Args extends readonly unknown[], R>(
		fn: (...args: Args) => Promise<R>,
		indices: readonly IdParamIndex<Args>[]
	) =>
	async (...args: Args): Promise<R> => {
		for (const index of indices) {
			const value = args[index];
			if (typeof value !== 'string' || !isUUIDv7(value)) {
				throw INVALID_ID_ERROR;
			}
		}

		return await fn(...args);
	};
