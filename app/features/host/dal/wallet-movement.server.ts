import {
  and,
  asc,
  count,
  desc,
  eq,
  gt,
  inArray,
  lt,
  max,
  min,
  type SQL,
  sql,
} from "drizzle-orm";
import type { AppDb } from "~/db/client.server";
import { TransactionType } from "~/db/enums";
import { transaction } from "~/db/schema/van";
import { WALLET_MOVEMENT_TYPES } from "~/features/host/components/transaction/transaction-types";
import { mapTransactionOrderBy } from "~/features/host/dal/transaction-sort.server";
import { periodSqlFor } from "~/features/host/utils/chart-period.server";
import {
  toBucketChartPoints,
  toTxnChartPoint,
} from "~/features/host/utils/chart-points.server";
import type { ChartGranularity } from "~/features/host/utils/pick-chart-granularity.server";
import { toWalletTransactionListItem } from "~/features/host/utils/to-transaction-list-item.server";
import type { PaginationParams } from "~/features/pagination/types";
import { resolveSortedCursor } from "~/features/pagination/utils/resolve-sorted-cursor.server";
import { COMMON_SORT_CONFIGS } from "~/lib/generic-sorting.server";
import type { UUIDv7 } from "~/types/ids.server";

function walletMovementWhere(userId: UUIDv7) {
  return and(
    eq(transaction.userId, userId),
    inArray(transaction.type, WALLET_MOVEMENT_TYPES)
  );
}

/**
 * Canonical signs for wallet stats/chart and full-ledger balance:
 * - DEPOSIT / RENTAL_PAYMENT: keep stored amount (positive)
 * - RENTAL_RETURN: keep stored amount (already negative at insert)
 * - WITHDRAW: negate (stored positive; represents outflow)
 */
const signedTransferAmountSql = sql<number>`sum(case when ${transaction.type} = ${TransactionType.WITHDRAW} then -${transaction.amount} else ${transaction.amount} end)`;

function signedTransferAmount(amount: number, type: string) {
  return type === TransactionType.WITHDRAW ? -amount : amount;
}

/** Signed wallet balance — all types, same WITHDRAW rule as transfer stats. */
export async function getAccountSummary(db: AppDb, userId: UUIDv7) {
  const [result] = await db
    .select({ total: signedTransferAmountSql.mapWith(Number) })
    .from(transaction)
    .where(eq(transaction.userId, userId));
  return Number(result?.total ?? 0);
}

/** Wallet funding aggregates. Signed total: negate WITHDRAW only. */
export async function getUserTransferStats(db: AppDb, userId: UUIDv7) {
  const [result] = await db
    .select({
      count: count(),
      firstAt: min(transaction.createdAt),
      lastAt: max(transaction.createdAt),
      total: signedTransferAmountSql.mapWith(Number),
    })
    .from(transaction)
    .where(walletMovementWhere(userId));

  return result;
}

/** Chart points for wallet movements. Empty periods skipped. */
export async function getUserTransferChartData(
  db: AppDb,
  userId: UUIDv7,
  granularity: ChartGranularity
) {
  if (granularity === "txn") {
    const rows = await db
      .select({
        amount: transaction.amount,
        createdAt: transaction.createdAt,
        id: transaction.id,
        type: transaction.type,
      })
      .from(transaction)
      .where(walletMovementWhere(userId))
      .orderBy(asc(transaction.createdAt));

    return rows.map((row) =>
      toTxnChartPoint(
        signedTransferAmount(row.amount, row.type),
        row.createdAt,
        row.id
      )
    );
  }

  const period = periodSqlFor(granularity);

  const rows = await db
    .select({
      amount: signedTransferAmountSql.mapWith(Number),
      name: period,
    })
    .from(transaction)
    .where(walletMovementWhere(userId))
    .groupBy(period)
    .orderBy(asc(period));

  return toBucketChartPoints(rows);
}

export function getUserTransactionsPaginated(
  db: AppDb,
  { userId, ...pagination }: PaginationParams
) {
  const { cursorId, orderBy, take, orderByClause } = resolveSortedCursor(
    pagination,
    COMMON_SORT_CONFIGS.transaction
  );

  const conditions: SQL[] = [
    eq(transaction.userId, userId),
    inArray(transaction.type, WALLET_MOVEMENT_TYPES),
  ];

  if (cursorId) {
    conditions.push(
      orderBy.id === "desc"
        ? lt(transaction.id, cursorId)
        : gt(transaction.id, cursorId)
    );
  }

  const idOrder =
    orderBy.id === "desc" ? desc(transaction.id) : asc(transaction.id);
  const sortCols = mapTransactionOrderBy(orderByClause);

  return db
    .select({
      amount: transaction.amount,
      createdAt: transaction.createdAt,
      id: transaction.id,
      type: transaction.type,
    })
    .from(transaction)
    .where(and(...conditions))
    .orderBy(...sortCols, idOrder)
    .limit(take)
    .then((rows) => rows.map(toWalletTransactionListItem));
}
