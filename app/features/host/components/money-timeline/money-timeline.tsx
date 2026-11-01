/**
 * TanStack Charts money timeline. Use `LazyMoneyTimeline` from
 * `./lazy-money-timeline` so `@tanstack/charts` is code-split via React.lazy().
 */
// react-doctor-disable-next-line react-doctor/prefer-dynamic-import
import { barY, defineChart, dot, lineY } from "@tanstack/charts";
import { Chart } from "@tanstack/charts/react";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { scaleOrdinal } from "@tanstack/charts/scales/ordinal";
import type { ReactNode } from "react";
import { useMemo, ViewTransition } from "react";
import { css, cx } from "styled-system/css";
import { flex } from "styled-system/patterns";
import { chromeViewTransitionName } from "~/components/view-transition-names";
import { viewTransitionPage } from "~/components/view-transition-share";
import {
  formatAxisAmount,
  type MoneyDirection,
  type MoneyTimelineBucket,
  type MoneyTimelineData,
} from "~/features/host/utils/money-timeline";
import { displayPrice } from "~/features/vans/utils/display-price";
import {
  ENDPOINT_FILL,
  INFLOW_DIRECTION,
  INFLOW_FILL,
  LINE_FILL,
  OUTFLOW_DIRECTION,
  OUTFLOW_FILL,
  TIMELINE_CHART_HEIGHT_PX,
} from "./chart-tokens";
import { DirectionSwatch } from "./direction-swatch";

const BAR_RADIUS_PX = 3;
const ENDPOINT_RADIUS_PX = 4;
const LINE_STROKE_WIDTH_PX = 2;
const BAND_PADDING = 0.4;

interface TimelineBarRow {
  direction: MoneyDirection;
  key: string;
  period: string;
  value: number;
}

interface TimelineLineRow {
  cumulative: number;
  period: string;
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

/**
 * Long-form bar rows (one per direction) stack implicitly, positive above zero
 * and negative below, so each period reads as received on top of sent. The
 * cumulative line sits on the same currency axis.
 */
const createTimelineDefinition = (buckets: readonly MoneyTimelineBucket[]) => {
  const barRows: TimelineBarRow[] = [];
  const lineRows: TimelineLineRow[] = [];
  const labelByPeriod = new Map<string, string>();
  /** Month starts survive label thinning so the year rollover stays on the axis. */
  const keepLabels: string[] = [];

  for (const bucket of buckets) {
    labelByPeriod.set(bucket.key, bucket.label);

    if (bucket.key.endsWith("-01")) {
      keepLabels.push(bucket.key);
    }

    if (bucket.inflow > 0) {
      barRows.push({
        direction: "in",
        key: `${bucket.key}-in`,
        period: bucket.key,
        value: bucket.inflow,
      });
    }

    if (bucket.outflow > 0) {
      barRows.push({
        direction: "out",
        key: `${bucket.key}-out`,
        period: bucket.key,
        value: -bucket.outflow,
      });
    }

    lineRows.push({ cumulative: bucket.cumulative, period: bucket.key });
  }

  const lastPoint = lineRows.at(-1);

  return defineChart({
    color: {
      scale: scaleOrdinal(
        [INFLOW_DIRECTION, OUTFLOW_DIRECTION],
        [INFLOW_FILL, OUTFLOW_FILL]
      ),
    },

    marks: [
      barY(barRows, {
        color: "direction",
        key: "key",
        radius: { end: BAR_RADIUS_PX },
        x: "period",
        y: "value",
      }),
      lineY(lineRows, {
        stroke: LINE_FILL,
        strokeWidth: LINE_STROKE_WIDTH_PX,
        x: "period",
        y: "cumulative",
      }),
      dot(lastPoint ? [lastPoint] : [], {
        fill: ENDPOINT_FILL,
        r: ENDPOINT_RADIUS_PX,
        stroke: LINE_FILL,
        strokeWidth: LINE_STROKE_WIDTH_PX,
        x: "period",
        y: "cumulative",
      }),
    ],
    scales: {
      x: {
        axis: {
          tickLabels: { thin: { keep: keepLabels } },
          ticks: {
            format: (value) =>
              labelByPeriod.get(String(value)) ?? String(value),
          },
        },
        scale: () => scaleBand<string>().padding(BAND_PADDING),
      },
      y: {
        axis: { ticks: { format: formatAxisAmount } },
        grid: true,
        nice: true,
        scale: scaleLinear,
      },
    },
  });
};

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

  const definition = useMemo(
    () => createTimelineDefinition(data.buckets),
    [data.buckets]
  );

  return (
    <ViewTransition
      {...viewTransitionPage}
      name={chromeViewTransitionName.hostChart}
    >
      {/* Plotted straight on the page surface: a chart is not a card. */}
      <div className={css({ marginBlockStart: "5" })}>
        <p className={currencyCaption}>USD</p>
        {/* Inline size only: the scene's own height sizes this box, so the grid
            row grows to the chart instead of clipping it into the sort row. */}
        <div className={css({ inlineSize: "full" })}>
          <Chart
            ariaLabel={ariaLabel}
            definition={definition}
            height={TIMELINE_CHART_HEIGHT_PX}
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
            Cumulative net
          </span>
        </div>
      </div>
    </ViewTransition>
  );
};

export default MoneyTimelineComponent;
