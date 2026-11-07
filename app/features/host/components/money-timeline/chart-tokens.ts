import { css } from "styled-system/css/css";
/**
 * Values shared by the lazy chart and its eager skeleton. Kept out of
 * `money-timeline.tsx` so the skeleton never pulls `@chartlite/react` into the
 * main bundle.
 */

/** Scene height in pixels: the chart takes a number, not a CSS length. */
export const TIMELINE_CHART_HEIGHT_PX = 350;

/**
 * Local aliases so fills stay stable when Panda hashes token CSS variables.
 * Chartlite `cssVars` paints through `--cl-series-*` / `--cl-bg` / `--cl-text` /
 * `--cl-grid`; map those onto the host chart palette.
 */
export const moneyChartClassName = css({
  "--chart-inflow": "{colors.chart.inflow}",
  "--chart-line": "{colors.foreground}",
  "--chart-outflow": "{colors.chart.outflow}",
  "--cl-bg": "transparent",
  "--cl-grid": "{colors.border.subtle}",
  "--cl-series-0": "{colors.chart.inflow}",
  "--cl-series-1": "{colors.chart.outflow}",
  "--cl-series-2": "{colors.foreground}",
  "--cl-text": "{colors.muted.foreground}",
});

export const INFLOW_FILL = "var(--chart-inflow)";
export const OUTFLOW_FILL = "var(--chart-outflow)";
export const LINE_FILL = "var(--chart-line)";
