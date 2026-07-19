import type { AppDb } from "~/db/client.server";
import {
  getHostIncomeChartData,
  getHostIncomeStats,
  getHostTransactionsPaginated,
} from "~/features/host/dal/transaction.server";
import { resolveChartContext } from "~/features/host/utils/resolve-chart-context.server";
import type {
  BasePaginationParams,
  SortOption,
} from "~/features/pagination/types";
import { toPagination } from "~/features/pagination/utils/to-pagination.server";
import type { Prettify } from "~/types";
import type { UUIDv7 } from "~/types/ids.server";
import { tryCatch } from "~/utils/try-catch.server";

export type HostPaginatedPageParams = Prettify<
  BasePaginationParams & {
    sort: SortOption;
  }
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

  const { data: stats } = await tryCatch(() => getHostIncomeStats(db, userId));

  const { count, elapsedDays, granularity } = resolveChartContext({
    count: stats?.count ?? 0,
    firstAt: stats?.firstAt,
    lastAt: stats?.lastAt,
  });

  const { data: chartData } = await tryCatch(() =>
    getHostIncomeChartData(db, userId, granularity)
  );

  return {
    chartData: chartData ?? [],
    elapsedDays,
    granularity,
    pagePromise,
    sumIncome: stats?.total ?? 0,
    txnCount: count,
  };
}
