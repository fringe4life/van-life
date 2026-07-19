import { pickChartGranularity } from "~/features/host/utils/pick-chart-granularity.server";
import type { Maybe } from "~/types";
import { elapsedDaysFromRange } from "~/utils/get-elapsed-time.server";

export interface TransactionSpanStats {
  count: number;
  firstAt: Maybe<Date>;
  lastAt: Maybe<Date>;
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
