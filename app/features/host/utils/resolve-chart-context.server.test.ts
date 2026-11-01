import { describe, expect, it } from "bun:test";
import {
  resolveChartContext,
  toTransactionAggStats,
} from "./resolve-chart-context.server";

describe("toTransactionAggStats", () => {
  it("returns zeros and nulls when row missing", () => {
    expect(toTransactionAggStats(undefined)).toEqual({
      count: 0,
      firstAt: null,
      lastAt: null,
      total: 0,
    });
    expect(toTransactionAggStats(null)).toEqual({
      count: 0,
      firstAt: null,
      lastAt: null,
      total: 0,
    });
  });

  it("passes through a complete row", () => {
    const firstAt = new Date("2024-01-01T00:00:00Z");
    const lastAt = new Date("2024-06-01T00:00:00Z");

    expect(
      toTransactionAggStats({
        count: 12,
        firstAt,
        lastAt,
        total: 450.5,
      })
    ).toEqual({
      count: 12,
      firstAt,
      lastAt,
      total: 450.5,
    });
  });

  it("coerces nullish total via Number", () => {
    expect(
      toTransactionAggStats({
        count: 3,
        firstAt: null,
        lastAt: null,
        total: null as unknown as number,
      })
    ).toEqual({
      count: 3,
      firstAt: null,
      lastAt: null,
      total: 0,
    });
  });
});

describe("resolveChartContext", () => {
  it("derives count and the inclusive day span from stats", () => {
    const result = resolveChartContext({
      count: 100,
      firstAt: new Date("2024-01-01T00:00:00Z"),
      lastAt: new Date("2024-02-01T00:00:00Z"),
    });

    expect(result).toEqual({ count: 100, elapsedDays: 32 });
  });

  it("reports no elapsed days for an empty ledger", () => {
    const result = resolveChartContext({
      count: 0,
      firstAt: null,
      lastAt: null,
    });

    expect(result.elapsedDays).toBe(0);
  });
});
