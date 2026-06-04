import { INVALID_ID_ERROR } from '~/constants/constants';
import { type UUIDv7, uuidv7Schema } from '~/dal/schemas.server';
import type { Maybe } from '~/types';
import { validateArkType } from '~/utils/parse-arktype.server';

/**
 * Parse and brand a string as UUIDv7. Throws INVALID_ID_ERROR on failure.
 */
export function parseUuidV7(value: string): UUIDv7 {
	const result = validateArkType(uuidv7Schema, value);

	if (!result.success) {
		throw new Error(INVALID_ID_ERROR);
	}

	return result.data;
}

/**
 * Parse cursor string when non-empty; undefined for empty/missing cursors.
 */
export function parseOptionalUuidV7(value: Maybe<string>): UUIDv7 | undefined {
	if (!value || value === '') {
		return;
	}

	return parseUuidV7(value);
}
