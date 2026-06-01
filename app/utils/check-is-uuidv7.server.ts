import { type } from 'arktype';
import { uuidv7Schema } from '~/lib/schemas';

/**
 * Returns true when `value` is a valid RFC 9562 UUID version 7 string.
 */
export function isUUIDv7(value: string): boolean {
	return !(uuidv7Schema(value) instanceof type.errors);
}
