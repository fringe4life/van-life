import {
  and,
  asc,
  count,
  desc,
  eq,
  gt,
  lt,
  max,
  min,
  type SQL,
  sql,
  sum,
} from "drizzle-orm";
import type { AppDb } from "~/db/client.server";
import { TransactionType } from "~/db/enums";
import { transaction } from "~/db/schema/van";
import { periodSqlFor } from "~/features/host/utils/chart-period.server";
import {
  toBucketChartPoints,
  toTxnChartPoint,
} from "~/features/host/utils/chart-points.server";
import type { ChartGranularity } from "~/features/host/utils/pick-chart-granularity.server";
import type { PaginationParams } from "~/features/pagination/types";
import { resolveSortedCursor } from "~/features/pagination/utils/resolve-sorted-cursor.server";
import {
  COMMON_SORT_CONFIGS,
  type OrderByClause,
} from "~/lib/generic-sorting.server";
import type { UUIDv7 } from "~/types/ids.server";

function mapTransactionOrderBy(orderByClause: OrderByClause) {
  return Object.entries(orderByClause).map(([field, dir]) => {
    const col = field === "amount" ? transaction.amount : transaction.createdAt;
    return dir === "asc" ? asc(col) : desc(col);
  });
}

function hostIncomeWhere(userId: UUIDv7) {
  return and(
    eq(transaction.userId, userId),
    eq(transaction.type, TransactionType.RENTAL_PAYMENT)
  );
}

function userTransactionsWhere(userId: UUIDv7) {
  return eq(transaction.userId, userId);
}

/**
 * Canonical transfer signs for chart/stats/balance:
 * - DEPOSIT / RENTAL_PAYMENT: keep stored amount (positive)
 * - RENTAL_RETURN: keep stored amount (already negative at insert)
 * - WITHDRAW: negate (stored positive; represents outflow)
 */
const signedTransferAmountSql = sql<number>`sum(case when ${transaction.type} = ${TransactionType.WITHDRAW} then -${transaction.amount} else ${transaction.amount} end)`;

function signedTransferAmount(amount: number, type: string) {
  return type === TransactionType.WITHDRAW ? -amount : amount;
}

/** Signed wallet balance — same WITHDRAW rule as transfer stats / balanceReducer. */
export async function getAccountSummary(db: AppDb, userId: UUIDv7) {
  const [result] = await db
    .select({ total: signedTransferAmountSql.mapWith(Number) })
    .from(transaction)
    .where(eq(transaction.userId, userId));
  return Number(result?.total ?? 0);
}

/**
 * Single-pass host income aggregates: total, span, and count.
 */
export async function getHostIncomeStats(db: AppDb, userId: UUIDv7) {
  const [result] = await db
    .select({
      count: count(),
      firstAt: min(transaction.createdAt),
      lastAt: max(transaction.createdAt),
      total: sum(transaction.amount).mapWith(Number),
    })
    .from(transaction)
    .where(hostIncomeWhere(userId));

  return result;
}

/**
 * Single-pass user transfer aggregates (signed total, span, count).
 * Signed total: negate WITHDRAW only; other types keep persisted amount.
 */
export async function getUserTransferStats(db: AppDb, userId: UUIDv7) {
  const [result] = await db
    .select({
      count: count(),
      firstAt: min(transaction.createdAt),
      lastAt: max(transaction.createdAt),
      total: signedTransferAmountSql.mapWith(Number),
    })
    .from(transaction)
    .where(userTransactionsWhere(userId));

  return result;
}

/**
 * Chart points for host income. Bucketed periods skip empty gaps (no zero-fill).
 */
export async function getHostIncomeChartData(
  db: AppDb,
  userId: UUIDv7,
  granularity: ChartGranularity
) {
  if (granularity === "txn") {
    const rows = await db
      .select({
        amount: transaction.amount,
        createdAt: transaction.createdAt,
      })
      .from(transaction)
      .where(hostIncomeWhere(userId))
      .orderBy(asc(transaction.createdAt));

    return rows.map((row) => toTxnChartPoint(row.amount, row.createdAt));
  }

  const period = periodSqlFor(granularity);

  const rows = await db
    .select({
      amount: sum(transaction.amount).mapWith(Number),
      name: period,
    })
    .from(transaction)
    .where(hostIncomeWhere(userId))
    .groupBy(period)
    .orderBy(asc(period));

  return toBucketChartPoints(rows);
}

/**
 * Chart points for user transfers (signed amounts). Empty periods skipped.
 */
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
        type: transaction.type,
      })
      .from(transaction)
      .where(userTransactionsWhere(userId))
      .orderBy(asc(transaction.createdAt));

    return rows.map((row) =>
      toTxnChartPoint(signedTransferAmount(row.amount, row.type), row.createdAt)
    );
  }

  const period = periodSqlFor(granularity);

  const rows = await db
    .select({
      amount: signedTransferAmountSql.mapWith(Number),
      name: period,
    })
    .from(transaction)
    .where(userTransactionsWhere(userId))
    .groupBy(period)
    .orderBy(asc(period));

  return toBucketChartPoints(rows);
}

export function getHostTransactionsPaginated(
  db: AppDb,
  { userId, ...pagination }: PaginationParams
) {
  const { cursorId, orderBy, take, orderByClause } = resolveSortedCursor(
    pagination,
    COMMON_SORT_CONFIGS.transaction
  );

  const conditions: SQL[] = [
    eq(transaction.userId, userId),
    eq(transaction.type, TransactionType.RENTAL_PAYMENT),
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
      rentId: transaction.rentId,
    })
    .from(transaction)
    .where(and(...conditions))
    .orderBy(...sortCols, idOrder)
    .limit(take);
}

export function getUserTransactionsPaginated(
  db: AppDb,
  { userId, ...pagination }: PaginationParams
) {
  const { cursorId, orderBy, take, orderByClause } = resolveSortedCursor(
    pagination,
    COMMON_SORT_CONFIGS.transaction
  );

  const conditions: SQL[] = [eq(transaction.userId, userId)];

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
    .limit(take);
}
