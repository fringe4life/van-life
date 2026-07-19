export interface ChartPoint {
  amount: number;
  name: string;
}

/** One bar per transaction (UTC instant label; TZ polish is follow-up). */
export function toTxnChartPoint(amount: number, createdAt: Date): ChartPoint {
  return {
    amount: Math.round(amount),
    name: createdAt.toISOString().slice(0, 16),
  };
}

/** One bar per non-empty period from `GROUP BY` + `SUM`. */
export function toBucketChartPoints(
  rows: { amount: number | null; name: string }[]
): ChartPoint[] {
  return rows.map((row) => ({
    amount: Math.round(row.amount ?? 0),
    name: row.name,
  }));
}
