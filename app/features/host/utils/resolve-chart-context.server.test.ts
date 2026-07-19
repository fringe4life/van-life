import { describe, expect, it } from "bun:test";
import { resolveChartContext } from "./resolve-chart-context.server";

describe("resolveChartContext", () => {
  it("derives count, elapsedDays, and granularity from stats", () => {
    const firstAt = new Date("2024-01-01T00:00:00Z");
    const lastAt = new Date("2024-02-01T00:00:00Z");

    const result = resolveChartContext({
      count: 100,
      firstAt,
      lastAt,
    });

    expect(result.count).toBe(100);
    expect(result.elapsedDays).toBe(32);
    expect(result.granularity).toBe("week");
  });

  it("uses txn granularity when count is small", () => {
    const result = resolveChartContext({
      count: 5,
      firstAt: new Date("2020-01-01T00:00:00Z"),
      lastAt: new Date("2024-01-01T00:00:00Z"),
    });

    expect(result.granularity).toBe("txn");
  });
});
