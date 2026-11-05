import { css } from "styled-system/css";

/**
 * Values shared by the lazy chart and its eager skeleton. Kept out of
 * `money-timeline.tsx` so the skeleton never pulls `@tanstack/charts` into the
 * main bundle.
 */

/** Scene height in pixels: the chart takes a number, not a CSS length. */
export const TIMELINE_CHART_HEIGHT_PX = 350;

/**
 * Local aliases so fills stay stable when Panda hashes token CSS variables.
 * Apply on an ancestor of the chart / skeleton.
 */
export const moneyChartClassName = css({
  "--chart-endpoint": "{colors.card}",
  "--chart-inflow": "{colors.chart.inflow}",
  "--chart-line": "{colors.foreground}",
  "--chart-outflow": "{colors.chart.outflow}",
});

export const INFLOW_FILL = "var(--chart-inflow)";
export const OUTFLOW_FILL = "var(--chart-outflow)";
export const LINE_FILL = "var(--chart-line)";
export const ENDPOINT_FILL = "var(--chart-endpoint)";

/** Direction keys double as the colour-scale domain. */
export const INFLOW_DIRECTION = "in";
export const OUTFLOW_DIRECTION = "out";
