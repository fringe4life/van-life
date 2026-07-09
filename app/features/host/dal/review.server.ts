import { and, asc, desc, eq, gt, lt, type SQL } from "drizzle-orm";
import type { AppDb } from "~/db/client.server";
import { user } from "~/db/schema/auth";
import { rent, review } from "~/db/schema/van";
import type { PaginationParams } from "~/features/pagination/types";
import { getCursorMetadata } from "~/features/pagination/utils/get-cursor-metadata.server";
import { reverseSortOption } from "~/features/pagination/utils/reverse-sort-order";
import {
  COMMON_SORT_CONFIGS,
  createGenericOrderBy,
  type OrderByClause,
} from "~/lib/generic-sorting.server";
import type { UUIDv7 } from "~/types/ids.server";

function mapReviewOrderBy(orderByClause: OrderByClause) {
  return Object.entries(orderByClause).map(([field, dir]) => {
    const col = field === "rating" ? review.rating : review.createdAt;
    return dir === "asc" ? asc(col) : desc(col);
  });
}

export async function getHostReviewsPaginated(
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
    COMMON_SORT_CONFIGS.review
  );

  const conditions: SQL[] = [eq(rent.hostId, userId)];

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
    createdAt: r.createdAt,
    id: r.id,
    rating: r.rating,
    rentId: r.rentId,
    text: r.text,
    updatedAt: r.updatedAt,
    user: { name: r.userName },
    userId: r.userId,
  }));
}

export function getHostReviewsChartData(db: AppDb, userId: UUIDv7) {
  return db
    .select({ rating: review.rating })
    .from(review)
    .innerJoin(rent, eq(review.rentId, rent.id))
    .where(eq(rent.hostId, userId))
    .orderBy(desc(review.createdAt));
}
