import type { AppDb } from "~/db/client.server";
import {
  getUserTransactionsPaginated,
  getUserTransferChartData,
  getUserTransferStats,
} from "~/features/host/dal/transaction.server";
import type { HostPaginatedPageParams } from "~/features/host/services/income.server";
import {
  resolveChartContext,
  toTransactionAggStats,
} from "~/features/host/utils/resolve-chart-context.server";
import { toPagination } from "~/features/pagination/utils/to-pagination.server";
import type { UUIDv7 } from "~/types/ids.server";
import { tryCatch } from "~/utils/try-catch.server";

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

  const { total, ...stats } = toTransactionAggStats(rawStats);

  const { count, elapsedDays, granularity } = resolveChartContext({
    ...stats,
  });

  const { data: chartData } = await tryCatch(() =>
    getUserTransferChartData(db, userId, granularity)
  );

  return {
    chartData: chartData ?? [],
    elapsedDays,
    granularity,
    pagePromise,
    sumAmount: total,
    txnCount: count,
  };
}
