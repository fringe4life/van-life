import type { AppDb } from "~/db/client.server";
import {
  getHostTransactionsPaginated,
  getRentalActivityStats,
  getRentalActivityTimeline,
} from "~/features/host/dal/rental-activity.server";
import {
  pickTimelineGranularity,
  toMoneyTimeline,
} from "~/features/host/utils/money-timeline";
import {
  resolveChartContext,
  toTransactionAggStats,
} from "~/features/host/utils/resolve-chart-context.server";
import type { BasePaginationParams, SortObject } from "~/pagination/types";
import { toPagination } from "~/pagination/utils/to-pagination.server";
import type { Prettify } from "~/types";
import type { UUIDv7 } from "~/types/ids.server";
import { tryCatch } from "~/utils/errors/try-catch.server";

export type HostPaginatedPageParams = Prettify<
  BasePaginationParams & SortObject
>;

export async function loadIncomePage(
  db: AppDb,
  userId: UUIDv7,
  { cursor, limit, direction, sort }: HostPaginatedPageParams
) {
  // Start list immediately; do not await — streamed via DeferredPaginated
  const pagePromise = getHostTransactionsPaginated(db, {
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

  const { data: rawStats } = await tryCatch(() =>
    getRentalActivityStats(db, userId)
  );

  const stats = toTransactionAggStats(rawStats);
  const { count, elapsedDays } = resolveChartContext(stats);
  const granularity = pickTimelineGranularity(elapsedDays);

  const { data: timelineRows, error: timelineError } = await tryCatch(() =>
    getRentalActivityTimeline(db, userId, granularity)
  );

  // Failed query → null so LazyMoneyTimeline shows errorState, not false zeros.
  const timeline = timelineError
    ? null
    : toMoneyTimeline({
        firstAt: stats.firstAt,
        granularity,
        lastAt: stats.lastAt,
        rows: timelineRows ?? [],
      });

  return {
    elapsedDays,
    pagePromise,
    timeline,
    txnCount: count,
  };
}
