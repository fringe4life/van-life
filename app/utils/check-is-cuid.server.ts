import { type } from 'arktype';
import { cuidSchema } from '~/lib/schemas.server';

/**
 * @abstract will test if the string is a CUID
 * @param {string} possibleCUID a possible CUID
 * @returns {boolean} true if CUID. else false
 */
export function isCUID(possibleCUID: string): boolean {
	const result = cuidSchema(possibleCUID);

	return !(result instanceof type.errors);
}
