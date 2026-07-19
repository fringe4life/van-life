import type { AppDb } from "~/db/client.server";
import {
  getUserTransactionsPaginated,
  getUserTransferChartData,
  getUserTransferStats,
} from "~/features/host/dal/transaction.server";
import type { HostPaginatedPageParams } from "~/features/host/services/income.server";
import { resolveChartContext } from "~/features/host/utils/resolve-chart-context.server";
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

  const { data: stats } = await tryCatch(() =>
    getUserTransferStats(db, userId)
  );

  const { count, elapsedDays, granularity } = resolveChartContext({
    count: stats?.count ?? 0,
    firstAt: stats?.firstAt,
    lastAt: stats?.lastAt,
  });

  const { data: chartData } = await tryCatch(() =>
    getUserTransferChartData(db, userId, granularity)
  );

  return {
    chartData: chartData ?? [],
    elapsedDays,
    granularity,
    pagePromise,
    sumAmount: stats?.total ?? 0,
    txnCount: count,
  };
}
