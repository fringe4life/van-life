import { uuidv7Schema } from '~/dal/schemas.server';
import { validateArkType } from '~/utils/parse-arktype.server';

/**
 * Returns true when `value` is a valid RFC 9562 UUID version 7 string.
 */
export function isUUIDv7(value: string): boolean {
	return validateArkType(uuidv7Schema, value).success;
}
