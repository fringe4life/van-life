import type { AppDb } from "~/db/client.server";
import {
  getHostTransactionsChartData,
  getHostTransactionsPaginated,
} from "~/features/host/dal/transaction.server";
import type { Direction, SortOption } from "~/features/pagination/types";
import { toPagination } from "~/features/pagination/utils/to-pagination.server";
import type { UUIDv7 } from "~/types/ids.server";
import { tryCatch } from "~/utils/try-catch.server";

export interface HostPaginatedPageParams {
  cursor: UUIDv7 | undefined;
  direction: Direction;
  limit: number;
  sort: SortOption;
}

export async function loadIncomePage(
  db: AppDb,
  userId: UUIDv7,
  { cursor, limit, direction, sort }: HostPaginatedPageParams
) {
  const [{ data: chartData }, { data: paginatedTransactions }] =
    await Promise.all([
      tryCatch(() => getHostTransactionsChartData(db, userId)),
      tryCatch(() =>
        getHostTransactionsPaginated(db, {
          cursor,
          direction,
          limit,
          sort,
          userId,
        })
      ),
    ]);

  const pagination = toPagination({
    cursor,
    direction,
    items: paginatedTransactions,
    limit,
  });

  return {
    chartData,
    ...pagination,
  };
}
