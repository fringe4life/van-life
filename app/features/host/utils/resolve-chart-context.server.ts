import { pickChartGranularity } from "~/features/host/utils/pick-chart-granularity.server";
import type { Maybe, Prettify } from "~/types";
import { elapsedDaysFromRange } from "~/utils/get-elapsed-time.server";

interface TransactionSpanStats {
  count: number;
  firstAt: Maybe<Date>;
  lastAt: Maybe<Date>;
}

type RawTransactionAggStats = Prettify<
  Partial<TransactionSpanStats> & { total: Maybe<number> }
>;
type TransactionAggStats = Prettify<TransactionSpanStats & { total: number }>;

/** Normalize optional aggregate row with nullish defaults. */
export function toTransactionAggStats(
  row: Maybe<RawTransactionAggStats>
): TransactionAggStats {
  return {
    count: row?.count ?? 0,
    firstAt: row?.firstAt ?? null,
    lastAt: row?.lastAt ?? null,
    total: Number(row?.total ?? 0),
  };
}

/**
 * Derive chart pick inputs from a single aggregate stats row
 * (`COUNT` + `MIN`/`MAX` createdAt — shared by income and transfers).
 */
export function resolveChartContext(stats: TransactionSpanStats) {
  const { count, firstAt, lastAt } = stats;
  const elapsedDays = elapsedDaysFromRange(firstAt, lastAt);
  const granularity = pickChartGranularity(count, elapsedDays);

  return { count, elapsedDays, granularity };
}
