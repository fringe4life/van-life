/**
 * Values shared by the lazy chart and its eager skeleton. Kept out of
 * `money-timeline.tsx` so the skeleton never pulls `@tanstack/charts` into the
 * main bundle.
 */

/** Scene height in pixels: the chart takes a number, not a CSS length. */
export const TIMELINE_CHART_HEIGHT_PX = 350;

/** Resolved token values handed to the chart's colour scale. */
export const INFLOW_FILL = "var(--colors-chart-inflow)";
export const OUTFLOW_FILL = "var(--colors-chart-outflow)";
export const LINE_FILL = "var(--colors-foreground)";
export const ENDPOINT_FILL = "var(--colors-card)";

/** Direction keys double as the colour-scale domain. */
export const INFLOW_DIRECTION = "in";
export const OUTFLOW_DIRECTION = "out";
