import type { AppDb } from "~/db/client.server";
import type { TransactionType } from "~/db/enums";
import { addMoney } from "~/features/host/dal/payment.server";
import type { UUIDv7 } from "~/types/ids.server";

export function depositOrWithdraw(
  db: AppDb,
  userId: UUIDv7,
  amount: number,
  transactionType: TransactionType
) {
  return addMoney(db, userId, amount, transactionType);
}
