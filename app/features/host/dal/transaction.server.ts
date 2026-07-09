import { and, asc, desc, eq, gt, lt, type SQL, sum } from "drizzle-orm";
import type { AppDb } from "~/db/client.server";
import { TransactionType } from "~/db/enums";
import { transaction } from "~/db/schema/van";
import type { PaginationParams, SortOption } from "~/features/pagination/types";
import { getCursorMetadata } from "~/features/pagination/utils/get-cursor-metadata.server";
import { reverseSortOption } from "~/features/pagination/utils/reverse-sort-order";
import {
  COMMON_SORT_CONFIGS,
  createGenericOrderBy,
  type OrderByClause,
} from "~/lib/generic-sorting.server";
import type { UUIDv7 } from "~/types/ids.server";

function mapTransactionOrderBy(orderByClause: OrderByClause) {
  return Object.entries(orderByClause).map(([field, dir]) => {
    const col = field === "amount" ? transaction.amount : transaction.createdAt;
    return dir === "asc" ? asc(col) : desc(col);
  });
}

export async function getAccountSummary(db: AppDb, userId: UUIDv7) {
  const [result] = await db
    .select({ total: sum(transaction.amount) })
    .from(transaction)
    .where(eq(transaction.userId, userId));
  return Number(result?.total ?? 0);
}

export async function getTransactionSummary(db: AppDb, userId: UUIDv7) {
  const [result] = await db
    .select({ total: sum(transaction.amount) })
    .from(transaction)
    .where(eq(transaction.userId, userId));
  return Number(result?.total ?? 0);
}

export function getHostTransactions(
  db: AppDb,
  userId: UUIDv7,
  sort: SortOption = "newest"
) {
  const orderByClause = createGenericOrderBy(sort, {
    dateField: "createdAt",
    valueField: "amount",
  });
  const sortCols = mapTransactionOrderBy(orderByClause);

  return db
    .select({
      amount: transaction.amount,
      createdAt: transaction.createdAt,
      id: transaction.id,
      rentId: transaction.rentId,
    })
    .from(transaction)
    .where(
      and(
        eq(transaction.userId, userId),
        eq(transaction.type, TransactionType.RENTAL_PAYMENT)
      )
    )
    .orderBy(...sortCols);
}

export function getHostTransactionsPaginated(
  db: AppDb,
  {
    userId,
    cursor,
    limit,
    direction = "forward",
    sort = "newest",
  }: PaginationParams
) {
  const { cursorId, orderBy, take } = getCursorMetadata({
    cursor,
    direction,
    limit,
  });

  const effectiveSort = reverseSortOption(sort, direction);
  const orderByClause = createGenericOrderBy(
    effectiveSort,
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
  {
    userId,
    cursor,
    limit,
    direction = "forward",
    sort = "newest",
  }: PaginationParams
) {
  const { cursorId, orderBy, take } = getCursorMetadata({
    cursor,
    direction,
    limit,
  });

  const effectiveSort = reverseSortOption(sort, direction);
  const orderByClause = createGenericOrderBy(
    effectiveSort,
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

export function getUserTransactionsChartData(db: AppDb, userId: UUIDv7) {
  return db
    .select({
      amount: transaction.amount,
      createdAt: transaction.createdAt,
      type: transaction.type,
    })
    .from(transaction)
    .where(eq(transaction.userId, userId));
}

export function getHostTransactionsChartData(db: AppDb, userId: UUIDv7) {
  return db
    .select({
      amount: transaction.amount,
      createdAt: transaction.createdAt,
    })
    .from(transaction)
    .where(
      and(
        eq(transaction.userId, userId),
        eq(transaction.type, TransactionType.RENTAL_PAYMENT)
      )
    );
}
