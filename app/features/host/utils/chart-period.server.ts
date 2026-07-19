import { sql } from "drizzle-orm";
import { transaction } from "~/db/schema/van";
import type { ChartGranularity } from "~/features/host/utils/pick-chart-granularity.server";

/** UTC period keys for SQLite `strftime` (ms epoch → unix seconds). */
const TRANSACTION_PERIOD_SQL = {
  day: sql<string>`strftime('%Y-%m-%d', ${transaction.createdAt} / 1000, 'unixepoch')`,
  month: sql<string>`strftime('%Y-%m', ${transaction.createdAt} / 1000, 'unixepoch')`,
  week: sql<string>`strftime('%Y-W%W', ${transaction.createdAt} / 1000, 'unixepoch')`,
} as const;

type BucketGranularity = Exclude<ChartGranularity, "txn">;

export function periodSqlFor(granularity: BucketGranularity) {
  return TRANSACTION_PERIOD_SQL[granularity];
}
