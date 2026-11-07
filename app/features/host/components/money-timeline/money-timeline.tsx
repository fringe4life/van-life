/**
 * Chartlite money timeline. Use `LazyMoneyTimeline` from
 * `./lazy-money-timeline` so `@chartlite/react` is code-split via React.lazy().
 *
 * Spike for #504: ComboChart (grouped inflow/outflow bars + cumulative line).
 * Chartlite does not stack combo bars, so diverging series sit side-by-side
 * rather than TanStack’s same-band stack.
 */
// react-doctor-disable-next-line react-doctor/prefer-dynamic-import
import { ComboChart } from "@chartlite/react";
import type { ReactNode } from "react";
import { ViewTransition } from "react";
import { css } from "styled-system/css/css";
import { cx } from "styled-system/css/cx";
import { flex } from "styled-system/patterns";
import { tabularNums } from "~/components/ui/figures";
import { chromeViewTransitionName } from "~/components/view-transition-names";
import { viewTransitionPage } from "~/components/view-transition-share";
import {
  formatAxisAmount,
  type MoneyTimelineBucket,
  type MoneyTimelineData,
} from "~/features/host/utils/money-timeline";
import { displayPrice } from "~/features/vans/utils/display-price";
import {
  INFLOW_FILL,
  LINE_FILL,
  moneyChartClassName,
  OUTFLOW_FILL,
  TIMELINE_CHART_HEIGHT_PX,
} from "./chart-tokens";
import { DirectionSwatch } from "./direction-swatch";

const SERIES_INFLOW = "inflow";
const SERIES_OUTFLOW = "outflow";
const SERIES_CUMULATIVE = "cumulative";
const CUMULATIVE_SERIES_NAME = "Cumulative net";

/** Row objects for Chartlite’s series-first format (open string index). */
interface TimelineComboRow {
  cumulative: number;
  inflow: number;
  outflow: number;
  x: string;
  [key: string]: number | string;
}

const currencyCaption = css({
  color: "muted.foreground",
  fontSize: "2xs",
  fontWeight: "bold",
  letterSpacing: "widest",
  margin: "0",
  marginBlockEnd: "1",
  textTransform: "uppercase",
});

/**
 * Chartlite already sets `font-variant-numeric: tabular-nums` on the SVG root;
 * keep the rule on the wrapper so our legend figures stay aligned with ticks
 * (#449, #476). Sans face on purpose: axis labels are `4k` / `−2k`, not money
 * mono currency amounts.
 */
const plot = cx(
  tabularNums,
  css({
    inlineSize: "full",
  })
);

const legend = css({
  borderBlockStart: "1px solid",
  borderColor: "border.subtle",
  color: "muted.foreground",
  fontSize: "xs",
  marginBlockStart: "1",
  paddingBlockStart: "3",
});

const legendItem = flex({
  alignItems: "center",
  gap: "2",
});

const lineMark = css({
  backgroundColor: "foreground",
  blockSize: "2px",
  display: "inline-block",
  flexShrink: "0",
  inlineSize: "18px",
});

const toComboRows = (
  buckets: readonly MoneyTimelineBucket[]
): TimelineComboRow[] =>
  buckets.map((bucket) => ({
    cumulative: bucket.cumulative,
    inflow: bucket.inflow,
    /** Negative so bars hang below zero beside the inflow column. */
    outflow: bucket.outflow > 0 ? -bucket.outflow : 0,
    x: bucket.key,
  }));

interface MoneyTimelineProps {
  data: MoneyTimelineData;
  inflowLabel: string;
  outflowLabel: string;
}

const MoneyTimelineComponent = ({
  data,
  inflowLabel,
  outflowLabel,
}: MoneyTimelineProps): ReactNode => {
  const closingNet = data.buckets.at(-1)?.cumulative ?? 0;
  const largestMovement = data.buckets.reduce(
    (largest, bucket) =>
      Math.max(largest, bucket.inflowPeak, bucket.outflowPeak),
    0
  );
  const ariaLabel = `${inflowLabel} and ${outflowLabel} by period from ${data.rangeLabel}, with cumulative net ending at ${displayPrice(closingNet)}. Largest single movement ${displayPrice(largestMovement)}.`;

  // React Compiler memoizes derived values — no manual useMemo/useCallback.
  const labelsByPeriod = new Map(
    data.buckets.map((bucket) => [bucket.key, bucket.label] as const)
  );
  const formatPeriodTick = (value: string | number) =>
    labelsByPeriod.get(String(value)) ?? String(value);
  const comboData = {
    data: toComboRows(data.buckets),
    series: [
      { dataKey: SERIES_INFLOW, name: inflowLabel, type: "bar" as const },
      { dataKey: SERIES_OUTFLOW, name: outflowLabel, type: "bar" as const },
      {
        dataKey: SERIES_CUMULATIVE,
        name: CUMULATIVE_SERIES_NAME,
        type: "line" as const,
      },
    ],
  };

  if (data.buckets.length === 0) {
    return null;
  }

  return (
    <ViewTransition
      {...viewTransitionPage}
      name={chromeViewTransitionName.hostChart}
    >
      {/* Plotted straight on the page surface: a chart is not a card. */}
      <div className={cx(moneyChartClassName, css({ marginBlockStart: "5" }))}>
        <p className={currencyCaption}>USD</p>
        {/* Inline size only: the scene's own height sizes this box, so the grid
            row grows to the chart instead of clipping it into the sort row. */}
        <div className={plot}>
          <ComboChart
            aria-label={ariaLabel}
            colors={[INFLOW_FILL, OUTFLOW_FILL, LINE_FILL]}
            cssVars
            curve="linear"
            data={comboData}
            height={TIMELINE_CHART_HEIGHT_PX}
            legend={false}
            showPoints={false}
            valueFormatter={formatAxisAmount}
            xFormatter={formatPeriodTick}
          />
        </div>

        <div
          className={cx(
            flex({
              alignItems: "center",
              columnGap: "6",
              rowGap: "2",
              wrap: "wrap",
            }),
            legend
          )}
        >
          <span className={legendItem}>
            <DirectionSwatch direction="in" />
            {inflowLabel}
          </span>
          <span className={legendItem}>
            <DirectionSwatch direction="out" />
            {outflowLabel}
          </span>
          <span className={legendItem}>
            <span aria-hidden="true" className={lineMark} />
            {CUMULATIVE_SERIES_NAME}
          </span>
        </div>
      </div>
    </ViewTransition>
  );
};

export default MoneyTimelineComponent;
