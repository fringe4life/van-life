import { describe, expect, it } from "bun:test";
import {
  CHART_HEIGHT_BAND_COLOR_BY_VARIANT,
  getChartBarPoints,
  getChartHeightBand,
  getChartHeightBands,
  getChartHeightBandVariantByPointId,
  getChartMagnitudeMax,
} from "./chart-height-bands";

const STABLE_BAND_KEYS = [
  "chart.1",
  "chart.2",
  "chart.3",
  "chart.4",
  "chart.5",
] as const;

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

  it("keeps five stable unique keys and labels at small domain maxima", () => {
    expect(getChartHeightBands(1).map((band) => band.label)).toEqual([
      "0–0.2",
      "0.2–0.4",
      "0.4–0.6",
      "0.6–0.8",
      "0.8–1+",
    ]);
    expect(getChartHeightBands(2).map((band) => band.label)).toEqual([
      "0–0.4",
      "0.4–0.8",
      "0.8–1.2",
      "1.2–1.6",
      "1.6–2+",
    ]);

    for (const domainMax of [1, 2] as const) {
      const bands = getChartHeightBands(domainMax);
      const labels = bands.map((band) => band.label);

      expect(bands).toHaveLength(5);
      expect(bands.map((band) => band.key)).toEqual([...STABLE_BAND_KEYS]);
      expect(new Set(bands.map((band) => band.key)).size).toBe(5);
      expect(new Set(labels).size).toBe(5);
    }
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

describe("getChartBarPoints", () => {
  it("creates one signed bar datum per finite point", () => {
    const points = getChartBarPoints([
      { amount: 10_000, id: "positive", name: "Jan" },
      { amount: -10_000, id: "negative", name: "Feb" },
      { amount: 0, id: "zero", name: "Mar" },
    ]);

    expect(points).toHaveLength(3);
    expect(points).toMatchObject([
      {
        amount: 10_000,
        bandKey: "chart.5",
        bandLabel: "8k–10k+",
        bandVariant: "five",
        id: "positive",
        sourceAmount: 10_000,
      },
      {
        amount: -10_000,
        bandKey: "chart.5",
        bandLabel: "8k–10k+",
        bandVariant: "five",
        id: "negative",
        sourceAmount: -10_000,
      },
      {
        amount: 0,
        bandKey: "chart.1",
        bandLabel: "0–2k",
        bandVariant: "one",
        id: "zero",
        sourceAmount: 0,
      },
    ]);
  });

  it("omits non-finite amounts without changing the domain", () => {
    const points = getChartBarPoints([
      { amount: Number.NaN, id: "invalid", name: "Jan" },
      { amount: 10, id: "valid", name: "Feb" },
    ]);

    expect(points).toHaveLength(1);
    expect(points[0]).toMatchObject({
      amount: 10,
      bandKey: "chart.5",
      id: "valid",
      sourceAmount: 10,
    });
  });

  it("sums amounts that share a displayed period name into one bar", () => {
    const points = getChartBarPoints([
      { amount: 10, id: "first", name: "2024-01-01T00:00" },
      { amount: 25, id: "second", name: "2024-01-01T00:00" },
      { amount: 5, id: "later", name: "2024-01-01T00:01" },
    ]);

    expect(points).toHaveLength(2);
    expect(points).toMatchObject([
      {
        amount: 35,
        id: "first",
        name: "2024-01-01T00:00",
        sourceAmount: 35,
      },
      {
        amount: 5,
        id: "later",
        name: "2024-01-01T00:01",
        sourceAmount: 5,
      },
    ]);
  });
});
