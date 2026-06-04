import { uuidv7 } from 'uuidv7';
import { parseUuidV7 } from '~/dal/parse-uuidv7.server';
import type { UUIDv7 } from '~/types/ids.server';

export function createId(): UUIDv7 {
	return parseUuidV7(uuidv7());
}
