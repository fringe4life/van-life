import { INVALID_ID_ERROR } from '~/constants/constants';
import { isCUID } from '~/lib/checkIsCUID.server';
import { prisma } from '~/lib/prisma.server';

export function addMoney(userId: string, amount: number) {
	if (!isCUID(userId)) {
		throw new Error(INVALID_ID_ERROR);
	}

	return prisma.userInfo.update({
		where: {
			userId,
		},
		data: {
			moneyAdded: {
				increment: amount,
			},
		},
	});
}
