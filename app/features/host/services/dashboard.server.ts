import type { AppDb } from "~/db/client.server";
import { getAverageReviewRating } from "~/features/host/dal/review-analytics.server";
import {
  getAccountSummary,
  getHostIncomeStats,
} from "~/features/host/dal/transaction.server";
import { toTransactionAggStats } from "~/features/host/utils/resolve-chart-context.server";
import { getHostVans } from "~/features/vans/dal/host-van.server";
import type { UUIDv7 } from "~/types/ids.server";
import { tryCatch } from "~/utils/errors/try-catch.server";
import { elapsedDaysFromRange } from "~/utils/get-elapsed-time.server";

const HOST_VANS_LIMIT = 2;

export async function loadHostDashboard(db: AppDb, userId: UUIDv7) {
  const vansPromise = Promise.resolve(
    getHostVans(db, userId, {
      cursor: undefined,
      direction: "forward",
      limit: HOST_VANS_LIMIT,
    })
  );

  const [
    { data: avgRating },
    { data: transactionSummary },
    { data: rawIncomeStats },
  ] = await Promise.all([
    tryCatch(() => getAverageReviewRating(db, userId)),
    tryCatch(() => getAccountSummary(db, userId)),
    tryCatch(() => getHostIncomeStats(db, userId)),
  ]);

  const { firstAt, lastAt, total } = toTransactionAggStats(rawIncomeStats);

  return {
    avgRating: avgRating ?? 0,
    elapsedDays: elapsedDaysFromRange(firstAt, lastAt),
    sumIncome: total,
    transactionSummary: transactionSummary ?? 0,
    vansPromise,
  };
}
