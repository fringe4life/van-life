import { uuidSchema } from '~/utils/schema.server';

export function checkIsUUID(possibleUUID: string) {
	const objectUUID = {
		possibleUUID,
	};

	const result = uuidSchema.safeParse(objectUUID);

	return result.success;
}
