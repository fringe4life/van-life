import type { AppDb } from "~/db/client.server";
import { getRentalActivityStats } from "~/features/host/dal/rental-activity.server";
import { getAverageReviewRating } from "~/features/host/dal/review-analytics.server";
import { getAccountSummary } from "~/features/host/dal/wallet-movement.server";
import { formatRangeLabel } from "~/features/host/utils/money-timeline";
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
    { data: avgRating },
    { data: transactionSummary },
    { data: rawIncomeStats },
  ] = await Promise.all([
    tryCatch(() => getAverageReviewRating(db, userId)),
    tryCatch(() => getAccountSummary(db, userId)),
    tryCatch(() => getRentalActivityStats(db, userId)),
  ]);

  const { firstAt, lastAt, total } = toTransactionAggStats(rawIncomeStats);

  return {
    avgRating: avgRating ?? 0,
    // Same label the financial routes put in their header slot, so the slot
    // reads as one value across the host pages.
    rangeLabel:
      firstAt && lastAt ? formatRangeLabel(firstAt, lastAt) : "No rentals yet",
    sumIncome: total,
    transactionSummary: transactionSummary ?? 0,
    vansPromise,
  };
}
