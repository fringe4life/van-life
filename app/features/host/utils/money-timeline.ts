import { TransactionType } from "~/db/enums";
import type { Maybe } from "~/types";

/** Which side of the ledger a transaction type moves money to. */
export type MoneyDirection = "in" | "out";

/**
 * Direction comes from the transaction type, never from the stored sign:
 * `RENTAL_RETURN` is stored negative while `WITHDRAW` is stored positive, so a
 * sign alone cannot tell an inflow from an outflow.
 */
export const MONEY_DIRECTION_BY_TYPE = {
  [TransactionType.DEPOSIT]: "in",
  [TransactionType.RENTAL_PAYMENT]: "in",
  [TransactionType.RENTAL_RETURN]: "out",
  [TransactionType.WITHDRAW]: "out",
} as const satisfies Record<TransactionType, MoneyDirection>;

/** Beyond this span day buckets crowd each other, so months take over. */
export const TIMELINE_DAY_MAX_SPAN_DAYS = 40;

/** Ceiling for zero-filled buckets: a runaway range must not build an endless axis. */
const MAX_TIMELINE_BUCKETS = 400;

const DAY_MS = 86_400_000;
const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export type TimelineGranularity = "day" | "month";

export interface MoneyTimelineRow {
  /** Movement magnitude: the DAL sums `abs(amount)`, so the stored sign is irrelevant. */
  amount: number;
  /** Largest single movement in the bucket; tooltip detail, not a second encoding. */
  peak: number;
  period: string;
  type: TransactionType;
}

export interface MoneyTimelineBucket {
  cumulative: number;
  inflow: number;
  inflowPeak: number;
  key: string;
  label: string;
  net: number;
  outflow: number;
  outflowPeak: number;
}

export interface MoneyTimelineData {
  buckets: MoneyTimelineBucket[];
  inflowTotal: number;
  netTotal: number;
  outflowTotal: number;
  /** Human range such as `Mar 2025 – Sep 2026`; empty when the ledger is empty. */
  rangeLabel: string;
}

const pad = (value: number): string => String(value).padStart(2, "0");

const toDayKey = (date: Date): string =>
  `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;

const monthLabel = (month: number): string =>
  MONTH_LABELS[month - 1] ?? `${month}`;

/** Month buckets name the year only on January, so the rollover stays visible. */
export function formatPeriodLabel(
  key: string,
  granularity: TimelineGranularity
): string {
  const [year, month, day] = key.split("-");

  if (!(year && month)) {
    return key;
  }

  const monthName = monthLabel(Number(month));

  if (granularity === "month") {
    return month === "01" ? `${monthName} ${year}` : monthName;
  }

  return day ? `${monthName} ${Number(day)}` : monthName;
}

export function formatRangeLabel(firstAt: Date, lastAt: Date): string {
  const first = `${monthLabel(firstAt.getUTCMonth() + 1)} ${firstAt.getUTCFullYear()}`;
  const last = `${monthLabel(lastAt.getUTCMonth() + 1)} ${lastAt.getUTCFullYear()}`;

  return first === last ? last : `${first} – ${last}`;
}

export function pickTimelineGranularity(spanDays: number): TimelineGranularity {
  return spanDays <= TIMELINE_DAY_MAX_SPAN_DAYS ? "day" : "month";
}

const MINUS_SIGN = "\u2212";
const TRAILING_ZERO = /\.0$/u;
const THOUSAND = 1000;
const TEN_THOUSAND = 10_000;

/**
 * Compact axis label: `4k`, `−2k`, `0`. The card names the currency once, so
 * ticks stay short enough to leave the plot area wide.
 */
export function formatAxisAmount(value: number): string {
  const magnitude = Math.abs(value);
  const sign = value < 0 ? MINUS_SIGN : "";

  if (magnitude < THOUSAND) {
    return `${sign}${Math.round(magnitude)}`;
  }

  const thousands = magnitude / THOUSAND;
  const digits = magnitude < TEN_THOUSAND ? 1 : 0;

  return `${sign}${thousands.toFixed(digits).replace(TRAILING_ZERO, "")}k`;
}

/** Every bucket key across the range, empty or not, in chronological order. */
function listPeriodKeys(
  firstAt: Date,
  lastAt: Date,
  granularity: TimelineGranularity
): string[] {
  const keys: string[] = [];

  if (granularity === "month") {
    let year = firstAt.getUTCFullYear();
    let month = firstAt.getUTCMonth();
    const lastYear = lastAt.getUTCFullYear();
    const lastMonth = lastAt.getUTCMonth();

    let withinMonthRange =
      year < lastYear || (year === lastYear && month <= lastMonth);

    while (withinMonthRange) {
      keys.push(`${year}-${pad(month + 1)}`);

      if (keys.length >= MAX_TIMELINE_BUCKETS) {
        break;
      }

      month += 1;

      if (month === 12) {
        month = 0;
        year += 1;
      }

      withinMonthRange =
        year < lastYear || (year === lastYear && month <= lastMonth);
    }

    return keys;
  }

  const start = Date.UTC(
    firstAt.getUTCFullYear(),
    firstAt.getUTCMonth(),
    firstAt.getUTCDate()
  );
  const end = Date.UTC(
    lastAt.getUTCFullYear(),
    lastAt.getUTCMonth(),
    lastAt.getUTCDate()
  );

  for (let time = start; time <= end; time += DAY_MS) {
    keys.push(toDayKey(new Date(time)));

    if (keys.length >= MAX_TIMELINE_BUCKETS) {
      break;
    }
  }

  return keys;
}

interface BucketAccumulator {
  inflow: number;
  inflowPeak: number;
  outflow: number;
  outflowPeak: number;
}

const emptyAccumulator = (): BucketAccumulator => ({
  inflow: 0,
  inflowPeak: 0,
  outflow: 0,
  outflowPeak: 0,
});

/**
 * Builds the plotted timeline: every period in the range, gaps included, with
 * running net. Empty periods are filled here rather than in SQL so the database
 * query stays a single indexed scan plus one `GROUP BY`.
 */
export function toMoneyTimeline({
  firstAt,
  granularity,
  lastAt,
  rows,
}: {
  firstAt: Maybe<Date>;
  granularity: TimelineGranularity;
  lastAt: Maybe<Date>;
  rows: readonly MoneyTimelineRow[];
}): MoneyTimelineData {
  if (!(firstAt && lastAt)) {
    return {
      buckets: [],
      inflowTotal: 0,
      netTotal: 0,
      outflowTotal: 0,
      rangeLabel: "",
    };
  }

  const byPeriod = new Map<string, BucketAccumulator>();

  for (const row of rows) {
    const magnitude = Math.abs(row.amount);
    const peak = Math.abs(row.peak);
    const existing = byPeriod.get(row.period) ?? emptyAccumulator();

    if (MONEY_DIRECTION_BY_TYPE[row.type] === "in") {
      existing.inflow += magnitude;
      existing.inflowPeak = Math.max(existing.inflowPeak, peak);
    } else {
      existing.outflow += magnitude;
      existing.outflowPeak = Math.max(existing.outflowPeak, peak);
    }

    byPeriod.set(row.period, existing);
  }

  let cumulative = 0;
  let inflowTotal = 0;
  let outflowTotal = 0;

  const keys = listPeriodKeys(firstAt, lastAt, granularity);
  const buckets = keys.map((key) => {
    const period = byPeriod.get(key) ?? emptyAccumulator();
    const net = period.inflow - period.outflow;

    cumulative += net;
    inflowTotal += period.inflow;
    outflowTotal += period.outflow;

    return {
      cumulative,
      inflow: period.inflow,
      inflowPeak: period.inflowPeak,
      key,
      label: formatPeriodLabel(key, granularity),
      net,
      outflow: period.outflow,
      outflowPeak: period.outflowPeak,
    };
  });

  // Label the window we actually plotted — a capped axis must not claim the
  // full firstAt/lastAt span when later buckets were dropped.
  const rangeStart = keys[0] ? periodKeyToDate(keys[0], granularity) : firstAt;
  const rangeEnd = keys.at(-1)
    ? periodKeyToDate(keys.at(-1) ?? "", granularity)
    : lastAt;

  return {
    buckets,
    inflowTotal,
    netTotal: inflowTotal - outflowTotal,
    outflowTotal,
    rangeLabel: formatRangeLabel(rangeStart, rangeEnd),
  };
}

/** Parse a zero-fill key back to a UTC date for the range caption. */
function periodKeyToDate(key: string, granularity: TimelineGranularity): Date {
  const [yearText, monthText, dayText] = key.split("-");
  const year = Number(yearText);
  const month = Number(monthText) - 1;

  if (granularity === "month") {
    return new Date(Date.UTC(year, month, 1));
  }

  return new Date(Date.UTC(year, month, Number(dayText)));
}
