import type { AppDb } from "~/db/client.server";
import type { TransactionType } from "~/db/enums";
import { transaction } from "~/db/schema/van";
import type { UUIDv7 } from "~/types/ids.server";

export async function addMoney(
  db: AppDb,
  userId: UUIDv7,
  amount: number,
  transactionType: TransactionType
) {
  const [created] = await db
    .insert(transaction)
    .values({
      amount,
      type: transactionType,
      userId,
    })
    .returning();
  return created;
}
