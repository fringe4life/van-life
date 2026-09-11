import { describe, expect, it } from "bun:test";
import {
  CHART_HEIGHT_BAND_COLOR_BY_VARIANT,
  expandToCumulativeChartPoints,
  getChartHeightBand,
  getChartHeightBands,
  getChartHeightBandVariantByPointId,
  getChartMagnitudeMax,
} from "./chart-height-bands";

describe("getChartMagnitudeMax", () => {
  it("uses the largest absolute value", () => {
    expect(
      getChartMagnitudeMax([{ amount: 240 }, { amount: -980 }, { amount: 720 }])
    ).toBe(980);
  });

  it("ignores non-finite values", () => {
    expect(getChartMagnitudeMax([{ amount: Number.NaN }, { amount: 0 }])).toBe(
      0
    );
  });
});

describe("getChartHeightBands", () => {
  it("divides the current domain into five labeled bands", () => {
    expect(getChartHeightBands(10_000).map((band) => band.label)).toEqual([
      "0–2k",
      "2k–4k",
      "4k–6k",
      "6k–8k",
      "8k–10k+",
    ]);
  });
});

describe("getChartHeightBand", () => {
  it("maps equal-magnitude values to the same band", () => {
    expect(getChartHeightBand(2000, 10_000).key).toBe("chart.2");
    expect(getChartHeightBand(-2000, 10_000).key).toBe("chart.2");
  });

  it("clamps values above the current domain to the final band", () => {
    expect(getChartHeightBand(12_000, 10_000).key).toBe("chart.5");
  });
});

describe("getChartHeightBandVariantByPointId", () => {
  it("colors each named bar by the slice its magnitude reaches", () => {
    const variants = getChartHeightBandVariantByPointId([
      { amount: 100, id: "5" },
      { amount: 10, id: "1" },
      { amount: 0, id: "3" },
    ]);

    expect(variants.get("5")).toBe("five");
    expect(variants.get("1")).toBe("one");
    expect(variants.get("3")).toBe("one");
  });
});

describe("CHART_HEIGHT_BAND_COLOR_BY_VARIANT", () => {
  it("maps band variants onto the chart token CSS variables", () => {
    expect(CHART_HEIGHT_BAND_COLOR_BY_VARIANT.one).toBe(
      "var(--colors-chart-1)"
    );
    expect(CHART_HEIGHT_BAND_COLOR_BY_VARIANT.five).toBe(
      "var(--colors-chart-5)"
    );
  });
});

describe("expandToCumulativeChartPoints", () => {
  it("creates cumulative positive segments from the baseline", () => {
    expect(
      expandToCumulativeChartPoints([
        { amount: 10_000, id: "positive", name: "Jan" },
      ])
    ).toMatchObject([
      { bandKey: "chart.1", end: 2000, start: 0 },
      { bandKey: "chart.2", end: 4000, start: 2000 },
      { bandKey: "chart.3", end: 6000, start: 4000 },
      { bandKey: "chart.4", end: 8000, start: 6000 },
      { bandKey: "chart.5", end: 10_000, start: 8000 },
    ]);
  });

  it("keeps the same band colors while reversing negative direction", () => {
    expect(
      expandToCumulativeChartPoints([
        { amount: -10_000, id: "negative", name: "Jan" },
      ])
    ).toMatchObject([
      { bandKey: "chart.1", end: -2000, start: 0 },
      { bandKey: "chart.2", end: -4000, start: -2000 },
      { bandKey: "chart.3", end: -6000, start: -4000 },
      { bandKey: "chart.4", end: -8000, start: -6000 },
      { bandKey: "chart.5", end: -10_000, start: -8000 },
    ]);
  });

  it("stops at the last band the magnitude reaches and skips zeros", () => {
    const points = expandToCumulativeChartPoints([
      { amount: 10_000, id: "full", name: "Jan" },
      { amount: 3000, id: "partial", name: "Feb" },
      { amount: 0, id: "zero", name: "Mar" },
    ]);

    expect(
      points.filter((point) => point.id.startsWith("partial-"))
    ).toMatchObject([
      { bandKey: "chart.1", end: 2000, id: "partial-one", start: 0 },
      { bandKey: "chart.2", end: 3000, id: "partial-two", start: 2000 },
    ]);
    expect(points.some((point) => point.id.startsWith("zero-"))).toBe(false);
  });
});
