import { addMoney } from '~/features/host/dal/payment.server';
import type { TransactionType } from '~/generated/prisma/enums';
import type { UUIDv7 } from '~/types/ids.server';

export function depositOrWithdraw(
	userId: UUIDv7,
	amount: number,
	transactionType: TransactionType
) {
	return addMoney(userId, amount, transactionType);
}
