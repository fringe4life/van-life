import type { AppDb } from "~/db/client.server";
import {
  getUserTransactionsPaginated,
  getUserTransferStats,
  getUserTransferTimeline,
} from "~/features/host/dal/wallet-movement.server";
import type { HostPaginatedPageParams } from "~/features/host/services/income.server";
import {
  pickTimelineGranularity,
  toMoneyTimeline,
} from "~/features/host/utils/money-timeline";
import {
  resolveChartContext,
  toTransactionAggStats,
} from "~/features/host/utils/resolve-chart-context.server";
import { toPagination } from "~/pagination/utils/to-pagination.server";
import type { UUIDv7 } from "~/types/ids.server";
import { tryCatch } from "~/utils/errors/try-catch.server";

export async function loadTransfersPage(
  db: AppDb,
  userId: UUIDv7,
  { cursor, limit, direction, sort }: HostPaginatedPageParams
) {
  // Start list immediately; do not await — streamed via DeferredPaginated
  const pagePromise = getUserTransactionsPaginated(db, {
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
    getUserTransferStats(db, userId)
  );

  const stats = toTransactionAggStats(rawStats);
  const { count, elapsedDays } = resolveChartContext(stats);
  const granularity = pickTimelineGranularity(elapsedDays);

  const { data: timelineRows, error: timelineError } = await tryCatch(() =>
    getUserTransferTimeline(db, userId, granularity)
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
