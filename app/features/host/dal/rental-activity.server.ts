import {
  and,
  asc,
  count,
  desc,
  eq,
  inArray,
  max,
  min,
  type SQL,
  sql,
  sum,
} from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";
import type { AppDb } from "~/db/client.server";
import { user } from "~/db/schema/auth";
import { rent, transaction } from "~/db/schema/van";
import { RENTAL_ACTIVITY_TYPES } from "~/features/host/components/transaction/transaction-types";
import {
  mapTransactionOrderBy,
  transactionKeysetPredicate,
} from "~/features/host/dal/transaction-sort.server";
import { periodSqlFor } from "~/features/host/utils/chart-period.server";
import type {
  MoneyTimelineRow,
  TimelineGranularity,
} from "~/features/host/utils/money-timeline";
import { toRentalTransactionListItem } from "~/features/host/utils/to-transaction-list-item.server";
import { COMMON_SORT_CONFIGS } from "~/lib/generic-sorting.server";
import type { PaginationParams } from "~/pagination/types";
import { resolveSortedCursor } from "~/pagination/utils/resolve-sorted-cursor.server";
import type { UUIDv7 } from "~/types/ids.server";

const renter = alias(user, "renter");
const hostUser = alias(user, "host_user");

const rentCounterpartyNameSql = sql<
  string | null
>`case when ${transaction.userId} = ${rent.hostId} then ${renter.name} else ${hostUser.name} end`;

function rentalActivityWhere(userId: UUIDv7) {
  return and(
    eq(transaction.userId, userId),
    inArray(transaction.type, RENTAL_ACTIVITY_TYPES)
  );
}

/** Rental pay + receive aggregates (`RENTAL_RETURN` amounts already negative). */
export async function getRentalActivityStats(db: AppDb, userId: UUIDv7) {
  const [result] = await db
    .select({
      count: count(),
      firstAt: min(transaction.createdAt),
      lastAt: max(transaction.createdAt),
      total: sum(transaction.amount).mapWith(Number),
    })
    .from(transaction)
    .where(rentalActivityWhere(userId));

  return result;
}

/**
 * Timeline rows for rental activity: one row per `(period, type)`, empty
 * periods filled by the presenter. `abs()` keeps the stored sign (returns are
 * negative) out of the aggregate; direction comes from `type` downstream.
 * Query plan and deferred tuning options: `periodSqlFor` in
 * `~/features/host/utils/chart-period.server`.
 */
export async function getRentalActivityTimeline(
  db: AppDb,
  userId: UUIDv7,
  granularity: TimelineGranularity
): Promise<MoneyTimelineRow[]> {
  const period = periodSqlFor(granularity);

  return await db
    .select({
      amount: sql<number>`sum(abs(${transaction.amount}))`.mapWith(Number),
      peak: sql<number>`max(abs(${transaction.amount}))`.mapWith(Number),
      period,
      type: transaction.type,
    })
    .from(transaction)
    .where(rentalActivityWhere(userId))
    .groupBy(period, transaction.type)
    .orderBy(asc(period));
}

export async function getHostTransactionsPaginated(
  db: AppDb,
  { userId, ...pagination }: PaginationParams
) {
  const { cursorId, orderBy, take, orderByClause } = resolveSortedCursor(
    pagination,
    COMMON_SORT_CONFIGS.transaction
  );

  const conditions: SQL[] = [
    eq(transaction.userId, userId),
    inArray(transaction.type, RENTAL_ACTIVITY_TYPES),
  ];

  const keyset = await transactionKeysetPredicate(
    db,
    cursorId,
    orderByClause,
    orderBy.id
  );
  if (keyset) {
    conditions.push(keyset);
  }

  const idOrder =
    orderBy.id === "desc" ? desc(transaction.id) : asc(transaction.id);
  const sortCols = mapTransactionOrderBy(orderByClause);

  const rows = await db
    .select({
      amount: transaction.amount,
      createdAt: transaction.createdAt,
      id: transaction.id,
      rentedAt: rent.rentedAt,
      rentedTo: rent.rentedTo,
      rentName: rentCounterpartyNameSql,
      type: transaction.type,
    })
    .from(transaction)
    .innerJoin(rent, eq(transaction.rentId, rent.id))
    .innerJoin(renter, eq(rent.renterId, renter.id))
    .innerJoin(hostUser, eq(rent.hostId, hostUser.id))
    .where(and(...conditions))
    .orderBy(...sortCols, idOrder)
    .limit(take);

  return rows.map(toRentalTransactionListItem);
}
