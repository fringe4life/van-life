import type { AppDb } from "~/db/client.server";
import {
  getHostReviewsChartData,
  getHostReviewsPaginated,
} from "~/features/host/dal/review.server";
import type { HostPaginatedPageParams } from "~/features/host/services/income.server";
import { toPagination } from "~/features/pagination/utils/to-pagination.server";
import type { UUIDv7 } from "~/types/ids.server";
import { tryCatch } from "~/utils/try-catch.server";

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

  const { data: chartData } = await tryCatch(() =>
    getHostReviewsChartData(db, userId)
  );

  const points = chartData ?? [];
  // Sum of histogram bars = total reviews (avoids a second COUNT query)
  const reviewCount = points.reduce((sum, point) => sum + point.amount, 0);

  return {
    chartData: points,
    pagePromise,
    reviewCount,
  };
}
