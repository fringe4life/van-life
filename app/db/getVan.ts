import { INVALID_ID_ERROR } from '~/constants/constants';
import { isCUID } from '~/lib/checkIsCUID.server';
import { prisma } from '~/lib/prisma.server';

export function getVan(id: string) {
	if (!isCUID(id)) {
		throw new Error(INVALID_ID_ERROR);
	}

	return prisma.van.findUnique({
		where: {
			id,
		},
	});
}
