import type { AppDb } from "~/db/client.server";
import type { TransactionType } from "~/db/enums";
import { addMoney } from "~/features/host/dal/payment.server";
import type { UUIDv7 } from "~/types/ids.server";
import { tryCatch } from "~/utils/errors/try-catch.server";
import { err, ok } from "~/utils/result";

export async function depositOrWithdraw(
  db: AppDb,
  userId: UUIDv7,
  amount: number,
  transactionType: TransactionType
) {
  const { data, error } = await tryCatch(() =>
    addMoney(db, userId, amount, transactionType)
  );

  if (error || !data) {
    return err({
      kind: "internal",
      message: "Something went wrong please try again later",
    });
  }

  return ok(data);
}
