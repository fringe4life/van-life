import { describe, expect, it } from "bun:test";
import {
  CHART_MAX_BARS,
  pickChartGranularity,
} from "./pick-chart-granularity.server";

describe("pickChartGranularity", () => {
  it("uses txn when count fits max bars (even over long span)", () => {
    expect(pickChartGranularity(20, 1000)).toBe("txn");
    expect(pickChartGranularity(CHART_MAX_BARS, 900)).toBe("txn");
  });

  it("uses day when count exceeds max but span fits", () => {
    expect(pickChartGranularity(100, 10)).toBe("day");
    expect(pickChartGranularity(50, CHART_MAX_BARS)).toBe("day");
  });

  it("uses week when day would exceed max bars", () => {
    expect(pickChartGranularity(100, 60)).toBe("week");
    expect(pickChartGranularity(200, 168)).toBe("week");
  });

  it("uses month when week would exceed max bars", () => {
    expect(pickChartGranularity(450, 1095)).toBe("month");
  });

  it("returns txn for empty series", () => {
    expect(pickChartGranularity(0, 0)).toBe("txn");
  });
});
