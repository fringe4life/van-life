import { type } from 'arktype';
import { cuidSchema } from '~/lib/schemas';

/**
 * @abstract will test if the string is a CUID
 * @param {string} possibleCuid a possible CUID
 * @returns {boolean} true if CUID. else false
 */
export function isCUID(possibleCuid: string): boolean {
	const result = cuidSchema(possibleCuid);

	return !(result instanceof type.errors);
}
