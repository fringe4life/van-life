import { describe, expect, it } from "bun:test";
import { TransactionType } from "~/db/enums";
import {
  formatPeriodLabel,
  formatRangeLabel,
  MONEY_DIRECTION_BY_TYPE,
  type MoneyTimelineRow,
  pickTimelineGranularity,
  TIMELINE_DAY_MAX_SPAN_DAYS,
  toMoneyTimeline,
} from "./money-timeline";

const rentalRow = (
  period: string,
  type: TransactionType,
  amount: number,
  peak = amount
): MoneyTimelineRow => ({ amount, peak, period, type });

describe("MONEY_DIRECTION_BY_TYPE", () => {
  it("maps rental and wallet types to their ledger side", () => {
    expect(MONEY_DIRECTION_BY_TYPE[TransactionType.RENTAL_PAYMENT]).toBe("in");
    expect(MONEY_DIRECTION_BY_TYPE[TransactionType.RENTAL_RETURN]).toBe("out");
    expect(MONEY_DIRECTION_BY_TYPE[TransactionType.DEPOSIT]).toBe("in");
    expect(MONEY_DIRECTION_BY_TYPE[TransactionType.WITHDRAW]).toBe("out");
  });
});

describe("pickTimelineGranularity", () => {
  it("uses days up to the span limit and months beyond it", () => {
    expect(pickTimelineGranularity(1)).toBe("day");
    expect(pickTimelineGranularity(TIMELINE_DAY_MAX_SPAN_DAYS)).toBe("day");
    expect(pickTimelineGranularity(TIMELINE_DAY_MAX_SPAN_DAYS + 1)).toBe(
      "month"
    );
  });
});

describe("formatPeriodLabel", () => {
  it("names the year on January only for month buckets", () => {
    expect(formatPeriodLabel("2025-03", "month")).toBe("Mar");
    expect(formatPeriodLabel("2026-01", "month")).toBe("Jan 2026");
  });

  it("renders month and day for day buckets", () => {
    expect(formatPeriodLabel("2025-03-05", "day")).toBe("Mar 5");
    expect(formatPeriodLabel("2025-03-15", "day")).toBe("Mar 15");
  });

  it("falls back to the raw key when it cannot be parsed", () => {
    expect(formatPeriodLabel("nonsense", "month")).toBe("nonsense");
  });
});

describe("formatRangeLabel", () => {
  it("collapses a range inside one month", () => {
    expect(
      formatRangeLabel(
        new Date("2026-09-01T00:00:00.000Z"),
        new Date("2026-09-30T00:00:00.000Z")
      )
    ).toBe("Sep 2026");
  });

  it("spans months", () => {
    expect(
      formatRangeLabel(
        new Date("2025-03-02T00:00:00.000Z"),
        new Date("2026-09-29T00:00:00.000Z")
      )
    ).toBe("Mar 2025 – Sep 2026");
  });
});

describe("toMoneyTimeline", () => {
  it("returns an empty timeline without a range", () => {
    const timeline = toMoneyTimeline({
      firstAt: null,
      granularity: "month",
      lastAt: null,
      rows: [],
    });

    expect(timeline.buckets).toEqual([]);
    expect(timeline.rangeLabel).toBe("");
    expect(timeline.netTotal).toBe(0);
  });

  it("fills empty periods and keeps a running net", () => {
    const timeline = toMoneyTimeline({
      firstAt: new Date("2025-01-09T00:00:00.000Z"),
      granularity: "month",
      lastAt: new Date("2025-04-02T00:00:00.000Z"),
      rows: [
        rentalRow("2025-01", TransactionType.RENTAL_PAYMENT, 1200),
        rentalRow("2025-03", TransactionType.RENTAL_RETURN, 400),
      ],
    });

    expect(timeline.buckets.map((bucket) => bucket.key)).toEqual([
      "2025-01",
      "2025-02",
      "2025-03",
      "2025-04",
    ]);
    expect(timeline.buckets.map((bucket) => bucket.net)).toEqual([
      1200, 0, -400, 0,
    ]);
    expect(timeline.buckets.map((bucket) => bucket.cumulative)).toEqual([
      1200, 1200, 800, 800,
    ]);
    expect(timeline.rangeLabel).toBe("Jan 2025 – Apr 2025");
  });

  it("treats magnitudes by type, not by stored sign", () => {
    const timeline = toMoneyTimeline({
      firstAt: new Date("2025-06-01T00:00:00.000Z"),
      granularity: "month",
      lastAt: new Date("2025-06-30T00:00:00.000Z"),
      rows: [
        // Stored negative in the database.
        rentalRow("2025-06", TransactionType.RENTAL_RETURN, -4000, 2500),
        rentalRow("2025-06", TransactionType.RENTAL_PAYMENT, 3000, 1500),
      ],
    });

    const [bucket] = timeline.buckets;

    expect(bucket?.inflow).toBe(3000);
    expect(bucket?.outflow).toBe(4000);
    expect(bucket?.inflowPeak).toBe(1500);
    expect(bucket?.outflowPeak).toBe(2500);
    expect(bucket?.net).toBe(-1000);
    expect(timeline.inflowTotal).toBe(3000);
    expect(timeline.outflowTotal).toBe(4000);
    expect(timeline.netTotal).toBe(-1000);
  });

  it("fills every day across a short span", () => {
    const timeline = toMoneyTimeline({
      firstAt: new Date("2025-06-01T00:00:00.000Z"),
      granularity: "day",
      lastAt: new Date("2025-06-04T00:00:00.000Z"),
      rows: [rentalRow("2025-06-02", TransactionType.RENTAL_PAYMENT, 250)],
    });

    expect(timeline.buckets.map((bucket) => bucket.key)).toEqual([
      "2025-06-01",
      "2025-06-02",
      "2025-06-03",
      "2025-06-04",
    ]);
    expect(timeline.buckets.map((bucket) => bucket.label)).toEqual([
      "Jun 1",
      "Jun 2",
      "Jun 3",
      "Jun 4",
    ]);
    expect(timeline.buckets[1]?.inflow).toBe(250);
  });

  it("caps a runaway month range and labels only the plotted window", () => {
    const timeline = toMoneyTimeline({
      firstAt: new Date("1500-01-01T00:00:00.000Z"),
      granularity: "month",
      lastAt: new Date("2500-01-01T00:00:00.000Z"),
      rows: [
        rentalRow("1500-01", TransactionType.RENTAL_PAYMENT, 100),
        rentalRow("2000-01", TransactionType.RENTAL_PAYMENT, 9000),
      ],
    });

    expect(timeline.buckets).toHaveLength(400);
    expect(timeline.buckets[0]?.key).toBe("1500-01");
    expect(timeline.buckets.at(-1)?.key).toBe("1533-04");
    expect(timeline.rangeLabel).toBe("Jan 1500 – Apr 1533");
    // The 2000 payment is outside the plotted window — totals match the axis.
    expect(timeline.inflowTotal).toBe(100);
    expect(timeline.netTotal).toBe(100);
  });
});
