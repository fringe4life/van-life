/**
 * Host chart aggregations stay cheap on D1 at tiny row counts.
 * Scale templates so each of 3 hosts gets >100 reviews / rents / wallet txs.
 * Stress: await chartData in loader vs defer (list already streams).
 */
export const SEED_VOLUME = {
  rents: 480,
  reviews: 480,
  transactions: 480,
} as const;

/** ~18 months → month-bucket chart path (count > 24 and span/7 > 24). */
const SEED_SPAN_DAYS = 540;

const MS_PER_DAY = 86_400_000;

export function expandSeed<T>(templates: readonly T[], count: number): T[] {
  if (templates.length === 0) {
    throw new Error("expandSeed needs at least one template");
  }

  return Array.from({ length: count }, (_, index) => ({
    ...templates[index % templates.length],
  }));
}

interface TimestampFields {
  createdAt?: Date;
  rentedAt?: Date;
  updatedAt?: Date;
}

export function staggerDates<T extends TimestampFields>(
  items: T[],
  spanDays = SEED_SPAN_DAYS
): T[] {
  const now = Date.now();
  const start = now - spanDays * MS_PER_DAY;
  const step = items.length > 1 ? (now - start) / (items.length - 1) : 0;

  return items.map((item, index) => {
    const at = new Date(start + step * index);
    return {
      ...item,
      ...(item.createdAt === undefined ? {} : { createdAt: at }),
      ...(item.rentedAt === undefined ? {} : { rentedAt: at }),
      ...(item.updatedAt === undefined ? {} : { updatedAt: at }),
    };
  });
}
