import { asc, desc } from "drizzle-orm";
import { transaction } from "~/db/schema/van";
import type { OrderByClause } from "~/lib/generic-sorting.server";

export function mapTransactionOrderBy(orderByClause: OrderByClause) {
  return Object.entries(orderByClause).map(([field, dir]) => {
    const col = field === "amount" ? transaction.amount : transaction.createdAt;
    return dir === "asc" ? asc(col) : desc(col);
  });
}
