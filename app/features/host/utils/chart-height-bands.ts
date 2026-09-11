import type { DataArray } from "~/features/host/types";

const BAND_COUNT = 5;
const TRAILING_ZERO_REGEX = /\.0$/;

export const CHART_HEIGHT_BAND_COLORS = [
  "var(--colors-chart-1)",
  "var(--colors-chart-2)",
  "var(--colors-chart-3)",
  "var(--colors-chart-4)",
  "var(--colors-chart-5)",
] as const;

const CHART_HEIGHT_BANDS = [
  { index: 0, key: "chart.1", variant: "one" },
  { index: 1, key: "chart.2", variant: "two" },
  { index: 2, key: "chart.3", variant: "three" },
  { index: 3, key: "chart.4", variant: "four" },
  { index: 4, key: "chart.5", variant: "five" },
] as const;

export const CHART_HEIGHT_BAND_COLOR_BY_VARIANT = {
  five: CHART_HEIGHT_BAND_COLORS[4],
  four: CHART_HEIGHT_BAND_COLORS[3],
  one: CHART_HEIGHT_BAND_COLORS[0],
  three: CHART_HEIGHT_BAND_COLORS[2],
  two: CHART_HEIGHT_BAND_COLORS[1],
} as const satisfies Record<
  (typeof CHART_HEIGHT_BANDS)[number]["variant"],
  (typeof CHART_HEIGHT_BAND_COLORS)[number]
>;

export type ChartHeightBandKey = (typeof CHART_HEIGHT_BANDS)[number]["key"];
export type ChartHeightBandVariant =
  (typeof CHART_HEIGHT_BANDS)[number]["variant"];

type ChartSourcePoint = Pick<DataArray[number], "amount" | "id" | "name">;

export interface ChartHeightBand {
  end: number;
  index: number;
  key: ChartHeightBandKey;
  label: string;
  start: number;
  variant: ChartHeightBandVariant;
}

export interface CumulativeChartPoint {
  bandKey: ChartHeightBandKey;
  bandLabel: string;
  bandVariant: ChartHeightBandVariant;
  end: number;
  id: string;
  name: string;
  sourceAmount: number;
  start: number;
}

const formatMagnitude = (value: number): string => {
  if (value < 1000) {
    return `${Math.round(value)}`;
  }

  const thousands = value / 1000;
  const formatted = thousands.toFixed(thousands < 10 ? 1 : 0);

  return `${formatted.replace(TRAILING_ZERO_REGEX, "")}k`;
};

const formatBandLabel = (start: number, end: number, isLast: boolean) =>
  `${formatMagnitude(start)}–${formatMagnitude(end)}${isLast ? "+" : ""}`;

export function getChartMagnitudeMax(
  points: readonly Pick<DataArray[number], "amount">[]
): number {
  let maximum = 0;

  for (const point of points) {
    if (Number.isFinite(point.amount)) {
      maximum = Math.max(maximum, Math.abs(point.amount));
    }
  }

  return maximum;
}

export function getChartHeightBands(domainMax: number): ChartHeightBand[] {
  if (domainMax <= 0 || !Number.isFinite(domainMax)) {
    return CHART_HEIGHT_BANDS.map((band) => ({
      ...band,
      end: 0,
      label: "0",
      start: 0,
    }));
  }

  const step = domainMax / BAND_COUNT;

  return CHART_HEIGHT_BANDS.map((band, index) => {
    const start = index * step;
    const end = (index + 1) * step;

    return {
      ...band,
      end,
      label: formatBandLabel(start, end, index === BAND_COUNT - 1),
      start,
    };
  });
}

export function getChartHeightBand(
  amount: number,
  domainMax: number
): ChartHeightBand {
  const bands = getChartHeightBands(domainMax);
  const magnitude = Math.abs(amount);
  const isZeroMagnitude = magnitude === 0;
  const isInvalidDomain = domainMax <= 0 || !Number.isFinite(domainMax);

  if (isZeroMagnitude || isInvalidDomain) {
    return bands[0];
  }

  const step = domainMax / BAND_COUNT;
  const index = Math.min(BAND_COUNT - 1, Math.floor(magnitude / step));

  return bands[index];
}

export function getChartHeightBandVariantByPointId(
  points: readonly Pick<DataArray[number], "amount" | "id">[]
): ReadonlyMap<string, ChartHeightBandVariant> {
  const domainMax = getChartMagnitudeMax(points);
  const variants = new Map<string, ChartHeightBandVariant>();

  for (const point of points) {
    variants.set(point.id, getChartHeightBand(point.amount, domainMax).variant);
  }

  return variants;
}

function expandPointToBands(
  { amount, id, name }: ChartSourcePoint,
  bands: readonly ChartHeightBand[]
): CumulativeChartPoint[] {
  if (!Number.isFinite(amount) || amount === 0) {
    return [];
  }

  const magnitude = Math.abs(amount);
  const direction = Math.sign(amount);
  const expandedPoints: CumulativeChartPoint[] = [];

  for (const band of bands) {
    if (band.start >= magnitude) {
      continue;
    }

    expandedPoints.push({
      bandKey: band.key,
      bandLabel: band.label,
      bandVariant: band.variant,
      end: direction * Math.min(magnitude, band.end),
      id: `${id}-${band.variant}`,
      name,
      sourceAmount: amount,
      start: band.start === 0 ? 0 : direction * band.start,
    });
  }

  return expandedPoints;
}

export function expandToCumulativeChartPoints(
  points: readonly ChartSourcePoint[]
): CumulativeChartPoint[] {
  const bands = getChartHeightBands(getChartMagnitudeMax(points));

  return points.flatMap((point) => expandPointToBands(point, bands));
}
