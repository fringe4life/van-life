import { sql } from "drizzle-orm";
import { transaction } from "~/db/schema/van";
import type { TimelineGranularity } from "~/features/host/utils/money-timeline";

/** UTC period keys for SQLite `strftime` (ms epoch → unix seconds). */
const TRANSACTION_PERIOD_SQL = {
  day: sql<string>`strftime('%Y-%m-%d', ${transaction.createdAt} / 1000, 'unixepoch')`,
  month: sql<string>`strftime('%Y-%m', ${transaction.createdAt} / 1000, 'unixepoch')`,
} as const;

/**
 * Period aggregate for the money timeline, shared by rental activity and wallet
 * movements. Callers group by `(period, type)` so direction is derived from
 * `type` rather than from the stored sign (RENTAL_RETURN is stored negative,
 * WITHDRAW is stored positive).
 *
 * Performance
 * - The `WHERE` is served by `Transaction_userId_type_createdAt_idx`: equality
 *   on `userId`, then one range per type from the `IN`. The scan never leaves
 *   the host's own rows, so cost scales with that host's volume, not the table.
 * - `GROUP BY` over an expression cannot be index-served, so SQLite builds a
 *   temp B-tree over the filtered rows. That is the work the previous
 *   single-column bucket query already did; adding `type` splits each bucket in
 *   two and adds no scan.
 * - Empty periods are filled in the app from the `MIN`/`MAX(createdAt)` that the
 *   stats query already returns: no recursive CTE, no calendar table, no second
 *   round trip.
 * - Result size is bounded by twice the bucket count, not by transaction count.
 *
 * Verify with `EXPLAIN QUERY PLAN` before changing this shape. Expected plan:
 *   SEARCH transaction USING INDEX Transaction_userId_type_createdAt_idx
 *     (userId=? AND type=?)
 *   USE TEMP B-TREE FOR GROUP BY
 *
 * Revisit only if this shows up in profiling (tracked on the money timeline
 * issue):
 * 1. Day buckets as an integer instead of a string — `CAST(createdAt /
 *    86400000 AS INTEGER)` — drops per-row `strftime` formatting; the presenter
 *    converts the integer back to a UTC date for labels.
 * 2. Month buckets from a stored generated column `periodMonth` indexed on
 *    `(userId, type, periodMonth)`, which lets SQLite group off the index and
 *    skip the temp B-tree entirely. Migration for later, not needed at current
 *    volume.
 * 3. A bounded window (`createdAt >= ?`) to pair with the period control; the
 *    same index makes that a cheap range scan.
 */
export function periodSqlFor(granularity: TimelineGranularity) {
  return TRANSACTION_PERIOD_SQL[granularity];
}
