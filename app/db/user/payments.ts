import { INVALID_ID_ERROR } from '~/constants/constants';
import type { TransactionType } from '~/generated/prisma/enums';
import { prisma } from '~/lib/prisma.server';
import { isCUID } from '~/utils/checkIsCUID.server';

export function addMoney(
	userId: string,
	amount: number,
	transactionType: TransactionType
) {
	if (!isCUID(userId)) {
		throw new Error(INVALID_ID_ERROR);
	}

	return prisma.transaction.create({
		data: {
			userId,
			amount,
			type: transactionType,
		},
	});
}
