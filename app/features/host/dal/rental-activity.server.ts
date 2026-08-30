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
import {
  toBucketChartPoints,
  toTxnChartPoint,
} from "~/features/host/utils/chart-points.server";
import type { ChartGranularity } from "~/features/host/utils/pick-chart-granularity.server";
import { toRentalTransactionListItem } from "~/features/host/utils/to-transaction-list-item.server";
import type { PaginationParams } from "~/features/pagination/types";
import { resolveSortedCursor } from "~/features/pagination/utils/resolve-sorted-cursor.server";
import { COMMON_SORT_CONFIGS } from "~/lib/generic-sorting.server";
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

/** Chart points for rental activity. Bucketed periods skip empty gaps. */
export async function getRentalActivityChartData(
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
      })
      .from(transaction)
      .where(rentalActivityWhere(userId))
      .orderBy(asc(transaction.createdAt));

    return rows.map((row) =>
      toTxnChartPoint(row.amount, row.createdAt, row.id)
    );
  }

  const period = periodSqlFor(granularity);

  const rows = await db
    .select({
      amount: sum(transaction.amount).mapWith(Number),
      name: period,
    })
    .from(transaction)
    .where(rentalActivityWhere(userId))
    .groupBy(period)
    .orderBy(asc(period));

  return toBucketChartPoints(rows);
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
