import type { TransactionType } from '~/generated/prisma/enums';
import { prisma } from '~/lib/prisma.server';

export function addMoney(
	userId: string,
	amount: number,
	transactionType: TransactionType
) {
	return prisma.transaction.create({
		data: {
			userId,
			amount,
			type: transactionType,
		},
	});
}
