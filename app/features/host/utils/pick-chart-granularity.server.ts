/**
 * Adaptive chart bar granularity for transaction time series.
 * Target ≤ {@link CHART_MAX_BARS} points using txn count + time span.
 */
export const CHART_MAX_BARS = 24;

export type ChartGranularity = "txn" | "day" | "week" | "month";

/**
 * @param txnCount - matching transaction rows
 * @param spanDays - inclusive day span from MIN→MAX createdAt (0 if empty)
 */
export function pickChartGranularity(
  txnCount: number,
  spanDays: number
): ChartGranularity {
  if (txnCount <= CHART_MAX_BARS) {
    return "txn";
  }
  if (spanDays <= CHART_MAX_BARS) {
    return "day";
  }
  if (spanDays / 7 <= CHART_MAX_BARS) {
    return "week";
  }
  return "month";
}
