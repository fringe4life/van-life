export interface ChartPoint {
  amount: number;
  id: string;
  name: string;
}

/** One bar per transaction (UTC instant label; TZ polish is follow-up). */
export function toTxnChartPoint(
  amount: number,
  createdAt: Date,
  id: string
): ChartPoint {
  return {
    amount: Math.round(amount),
    id,
    name: createdAt.toISOString().slice(0, 16),
  };
}

/** One bar per displayed UTC minute; same-minute amounts are summed. */
export function toTxnChartPoints(
  rows: readonly { amount: number; createdAt: Date; id: string }[]
): ChartPoint[] {
  const pointsByPeriod = new Map<string, ChartPoint>();

  for (const row of rows) {
    const point = toTxnChartPoint(row.amount, row.createdAt, row.id);
    const existing = pointsByPeriod.get(point.name);

    if (existing === undefined) {
      pointsByPeriod.set(point.name, point);
      continue;
    }

    existing.amount += point.amount;
  }

  return [...pointsByPeriod.values()];
}

/** One bar per non-empty period from `GROUP BY` + `SUM`. */
export function toBucketChartPoints(
  rows: { amount: number | null; name: string }[]
): ChartPoint[] {
  return rows.map((row) => ({
    amount: Math.round(row.amount ?? 0),
    id: row.name,
    name: row.name,
  }));
}
