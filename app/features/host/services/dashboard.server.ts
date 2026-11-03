import type { AppDb } from "~/db/client.server";
import {
  getRentalActivityStats,
  toRentalActivitySplit,
} from "~/features/host/dal/rental-activity.server";
import { getReviewSummary } from "~/features/host/dal/review-analytics.server";
import { getAccountSummary } from "~/features/host/dal/wallet-movement.server";
import { roundReviewAverage } from "~/features/host/utils/rating-mix";
import { toTransactionAggStats } from "~/features/host/utils/resolve-chart-context.server";
import { getHostVans } from "~/features/vans/dal/host-van.server";
import type { UUIDv7 } from "~/types/ids.server";
import { tryCatch } from "~/utils/errors/try-catch.server";

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
    { data: reviewSummary },
    { data: transactionSummary },
    { data: rawIncomeStats },
  ] = await Promise.all([
    tryCatch(() => getReviewSummary(db, userId)),
    tryCatch(() => getAccountSummary(db, userId)),
    tryCatch(() => getRentalActivityStats(db, userId)),
  ]);

  const { total } = toTransactionAggStats(rawIncomeStats);
  const { earnedAsHost, paidAsRenter } = toRentalActivitySplit(rawIncomeStats);

  return {
    avgRating: roundReviewAverage(reviewSummary?.average ?? 0),
    // Every figure in the summary band is all-time, so the band states that once
    // in its header slot instead of repeating a window per number (#453).
    earnedAsHost,
    paidAsRenter,
    reviewCount: reviewSummary?.count ?? 0,
    sumIncome: total,
    transactionSummary: transactionSummary ?? 0,
    vansPromise,
  };
}
