import { and, asc, count, desc, eq, gt, lt, type SQL } from "drizzle-orm";
import type { AppDb } from "~/db/client.server";
import { user } from "~/db/schema/auth";
import { rent, review } from "~/db/schema/van";
import type { ChartPoint } from "~/features/host/utils/chart-points.server";
import type { PaginationParams } from "~/features/pagination/types";
import { resolveSortedCursor } from "~/features/pagination/utils/resolve-sorted-cursor.server";
import {
  COMMON_SORT_CONFIGS,
  type OrderByClause,
} from "~/lib/generic-sorting.server";
import type { UUIDv7 } from "~/types/ids.server";
import { MAX_RATING } from "../constants/constants";

function mapReviewOrderBy(orderByClause: OrderByClause) {
  return Object.entries(orderByClause).map(([field, dir]) => {
    const col = field === "rating" ? review.rating : review.createdAt;
    return dir === "asc" ? asc(col) : desc(col);
  });
}

function hostReviewsWhere(userId: UUIDv7) {
  return eq(rent.hostId, userId);
}

export async function getHostReviewsPaginated(
  db: AppDb,
  { userId, ...pagination }: PaginationParams
) {
  const { cursorId, orderBy, take, orderByClause } = resolveSortedCursor(
    pagination,
    COMMON_SORT_CONFIGS.review
  );

  const conditions: SQL[] = [hostReviewsWhere(userId)];

  if (cursorId) {
    conditions.push(
      orderBy.id === "desc" ? lt(review.id, cursorId) : gt(review.id, cursorId)
    );
  }

  const idOrder = orderBy.id === "desc" ? desc(review.id) : asc(review.id);
  const sortCols = mapReviewOrderBy(orderByClause);

  const rows = await db
    .select({
      createdAt: review.createdAt,
      id: review.id,
      rating: review.rating,
      rentId: review.rentId,
      text: review.text,
      updatedAt: review.updatedAt,
      userId: review.userId,
      userName: user.name,
    })
    .from(review)
    .innerJoin(rent, eq(review.rentId, rent.id))
    .innerJoin(user, eq(review.userId, user.id))
    .where(and(...conditions))
    .orderBy(...sortCols, idOrder)
    .limit(take);

  return rows.map((r) => ({
    ...r,
    user: { name: r.userName },
  }));
}

/**
 * Star histogram for host reviews. Always returns ratings 1..5 (zeros filled).
 * ≤5 rows — not one row per review.
 */
export async function getHostReviewsChartData(
  db: AppDb,
  userId: UUIDv7
): Promise<ChartPoint[]> {
  const rows = await db
    .select({
      amount: count().mapWith(Number),
      rating: review.rating,
    })
    .from(review)
    .innerJoin(rent, eq(review.rentId, rent.id))
    .where(hostReviewsWhere(userId))
    .groupBy(review.rating)
    .orderBy(asc(review.rating));

  const byRating = new Map(rows.map((row) => [row.rating, row.amount]));

  return Array.from({ length: MAX_RATING }, (_, index) => {
    const rating = index + 1;
    return {
      amount: byRating.get(rating) ?? 0,
      name: String(rating),
    };
  });
}
