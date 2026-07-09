import { avg, eq } from "drizzle-orm";
import type { AppDb } from "~/db/client.server";
import { rent, review } from "~/db/schema/van";
import type { UUIDv7 } from "~/types/ids.server";

export async function getAverageReviewRating(db: AppDb, userId: UUIDv7) {
  const [result] = await db
    .select({ avgRating: avg(review.rating) })
    .from(review)
    .innerJoin(rent, eq(review.rentId, rent.id))
    .where(eq(rent.hostId, userId));

  return Number(result?.avgRating ?? 0);
}
