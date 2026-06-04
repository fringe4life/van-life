import type { TransactionType } from '~/generated/prisma/enums';
import { prisma } from '~/lib/prisma.server';
import type { UUIDv7 } from '~/types/ids.server';

export function addMoney(
	userId: UUIDv7,
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
