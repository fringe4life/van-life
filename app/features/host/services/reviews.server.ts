import type { AppDb } from "~/db/client.server";
import {
  getHostReviewRatingCounts,
  getHostReviewsPaginated,
} from "~/features/host/dal/review.server";
import type { HostPaginatedPageParams } from "~/features/host/services/income.server";
import { toRatingMix } from "~/features/host/utils/rating-mix";
import { toPagination } from "~/pagination/utils/to-pagination.server";
import type { UUIDv7 } from "~/types/ids.server";
import { tryCatch } from "~/utils/errors/try-catch.server";

export async function loadReviewsPage(
  db: AppDb,
  userId: UUIDv7,
  { cursor, limit, direction, sort }: HostPaginatedPageParams
) {
  // Start list immediately; do not await — streamed via DeferredPaginated
  const pagePromise = getHostReviewsPaginated(db, {
    cursor,
    direction,
    limit,
    sort,
    userId,
  }).then((items) =>
    toPagination({
      cursor,
      direction,
      items,
      limit,
    })
  );

  const { data: ratingCounts } = await tryCatch(() =>
    getHostReviewRatingCounts(db, userId)
  );

  const ratingMix = toRatingMix(ratingCounts ?? []);

  return {
    pagePromise,
    ratingMix,
    reviewCount: ratingMix.total,
  };
}
