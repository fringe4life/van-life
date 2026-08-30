import { asc, desc, eq } from "drizzle-orm";
import type { AppDb } from "~/db/client.server";
import { transaction } from "~/db/schema/van";
import { createKeysetCursorPredicate } from "~/features/pagination/utils/create-keyset-cursor.server";
import type { OrderByClause } from "~/lib/generic-sorting.server";
import type { Maybe } from "~/types";
import type { UUIDv7 } from "~/types/ids.server";

export function mapTransactionOrderBy(orderByClause: OrderByClause) {
  return Object.entries(orderByClause).map(([field, dir]) => {
    const col = field === "amount" ? transaction.amount : transaction.createdAt;
    return dir === "asc" ? asc(col) : desc(col);
  });
}

function primaryTransactionSort(orderByClause: OrderByClause) {
  const field = Object.hasOwn(orderByClause, "amount") ? "amount" : "createdAt";
  const direction = orderByClause[field] ?? "desc";
  const column =
    field === "amount" ? transaction.amount : transaction.createdAt;

  return { column, direction, field } as const;
}

/** Load cursor row sort value, then exclusive (sort, id) keyset predicate. */
export async function transactionKeysetPredicate(
  db: AppDb,
  cursorId: Maybe<UUIDv7>,
  orderByClause: OrderByClause,
  idDirection: "asc" | "desc"
) {
  if (!cursorId) {
    return;
  }

  const [row] = await db
    .select({
      amount: transaction.amount,
      createdAt: transaction.createdAt,
    })
    .from(transaction)
    .where(eq(transaction.id, cursorId))
    .limit(1);

  if (!row) {
    return;
  }

  const { column, direction, field } = primaryTransactionSort(orderByClause);

  return createKeysetCursorPredicate({
    cursorId,
    idColumn: transaction.id,
    idDirection,
    sortColumn: column,
    sortDirection: direction,
    sortValue: row[field],
  });
}
