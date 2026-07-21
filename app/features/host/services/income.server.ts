import type { AppDb } from "~/db/client.server";
import {
  getHostIncomeChartData,
  getHostIncomeStats,
  getHostTransactionsPaginated,
} from "~/features/host/dal/transaction.server";
import {
  resolveChartContext,
  toTransactionAggStats,
} from "~/features/host/utils/resolve-chart-context.server";
import type {
  BasePaginationParams,
  SortObject,
} from "~/features/pagination/types";
import { toPagination } from "~/features/pagination/utils/to-pagination.server";
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
    getHostIncomeStats(db, userId)
  );

  const { total, ...stats } = toTransactionAggStats(rawStats);

  const { count, elapsedDays, granularity } = resolveChartContext({
    ...stats,
  });

  const { data: chartData } = await tryCatch(() =>
    getHostIncomeChartData(db, userId, granularity)
  );

  return {
    chartData: chartData ?? [],
    elapsedDays,
    granularity,
    pagePromise,
    sumIncome: total,
    txnCount: count,
  };
}
