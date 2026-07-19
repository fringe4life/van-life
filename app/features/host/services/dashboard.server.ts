import type { AppDb } from "~/db/client.server";
import { getAverageReviewRating } from "~/features/host/dal/review-analytics.server";
import {
  getAccountSummary,
  getHostIncomeStats,
} from "~/features/host/dal/transaction.server";
import { getHostVans } from "~/features/vans/dal/host-van.server";
import type { UUIDv7 } from "~/types/ids.server";
import { elapsedDaysFromRange } from "~/utils/get-elapsed-time.server";
import { tryCatch } from "~/utils/try-catch.server";

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
    { data: incomeStats },
  ] = await Promise.all([
    tryCatch(() => getAverageReviewRating(db, userId)),
    tryCatch(() => getAccountSummary(db, userId)),
    tryCatch(() => getHostIncomeStats(db, userId)),
  ]);

  return {
    avgRating: avgRating ?? 0,
    elapsedDays: elapsedDaysFromRange(
      incomeStats?.firstAt,
      incomeStats?.lastAt
    ),
    sumIncome: incomeStats?.total ?? 0,
    transactionSummary: transactionSummary ?? 0,
    vansPromise,
  };
}
