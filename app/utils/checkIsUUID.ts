import { uuidSchema } from '~/lib/schemas.server';

/**
 * @abstract will test if the string is a UUID
 * @param {string} possibleUUID a possible UUID
 * @returns {boolean} true if UUID. else false
 */
export function checkIsUUID(possibleUUID: string): boolean {
	const objectUUID = {
		possibleUUID,
	};

	const result = uuidSchema.safeParse(objectUUID);

	return result.success;
}
