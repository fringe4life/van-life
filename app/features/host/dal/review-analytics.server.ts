import { avg, count, eq } from "drizzle-orm";
import type { AppDb } from "~/db/client.server";
import { rent, review } from "~/db/schema/van";
import type { UUIDv7 } from "~/types/ids.server";

/**
 * Reviews a host's vans received: the average and the count that qualifies it.
 * The dashboard states the average numerically, so the count has to travel with
 * it — "3.2" alone cannot say whether it is one review or two hundred.
 */
export async function getReviewSummary(db: AppDb, userId: UUIDv7) {
  const [result] = await db
    .select({ average: avg(review.rating), count: count() })
    .from(review)
    .innerJoin(rent, eq(review.rentId, rent.id))
    .where(eq(rent.hostId, userId));

  return {
    average: Number(result?.average ?? 0),
    count: Number(result?.count ?? 0),
  };
}
