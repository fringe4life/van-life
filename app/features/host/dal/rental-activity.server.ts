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
import type { Maybe } from "~/types";
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

/**
 * The same rental rows, split by which side of the trade the user was on.
 * `RENTAL_ACTIVITY_TYPES` filters on `userId` only, so an account that both
 * hosts and rents mixes earned and spent money in one total (#411). Stored
 * signs are kept, so a host-issued return counts against host earnings.
 */
const earnedAsHostSql = sql<number>`sum(case when ${rent.hostId} = ${transaction.userId} then ${transaction.amount} else 0 end)`;
const paidAsRenterSql = sql<number>`sum(case when ${rent.hostId} <> ${transaction.userId} then ${transaction.amount} else 0 end)`;

/** Rental pay + receive aggregates (`RENTAL_RETURN` amounts already negative). */
export async function getRentalActivityStats(db: AppDb, userId: UUIDv7) {
  const [result] = await db
    .select({
      count: count(),
      earnedAsHost: earnedAsHostSql.mapWith(Number),
      firstAt: min(transaction.createdAt),
      lastAt: max(transaction.createdAt),
      paidAsRenter: paidAsRenterSql.mapWith(Number),
      total: sum(transaction.amount).mapWith(Number),
    })
    .from(transaction)
    // A rental row always belongs to a rent, so this join never multiplies rows;
    // it only exposes `rent.hostId`, which is what tells the two sides apart.
    .leftJoin(rent, eq(transaction.rentId, rent.id))
    .where(rentalActivityWhere(userId));

  return result;
}

interface RentalActivitySideRow {
  earnedAsHost?: Maybe<number>;
  paidAsRenter?: Maybe<number>;
}

/** Nullish normalisation for the side split, so a failed row reads as zero. */
export function toRentalActivitySplit(row: Maybe<RentalActivitySideRow>) {
  return {
    earnedAsHost: Number(row?.earnedAsHost ?? 0),
    paidAsRenter: Number(row?.paidAsRenter ?? 0),
  };
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
