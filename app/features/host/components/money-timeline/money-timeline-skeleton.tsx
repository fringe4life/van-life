import type { CSSProperties, ReactNode } from "react";
import { ViewTransition } from "react";
import { css } from "styled-system/css/css";
import { cx } from "styled-system/css/cx";
import { flex } from "styled-system/patterns";
import { chromeViewTransitionName } from "~/components/view-transition-names";
import { viewTransitionPage } from "~/components/view-transition-share";
import { bgSkeleton } from "~/styles";
import {
  INFLOW_FILL,
  moneyChartClassName,
  OUTFLOW_FILL,
  TIMELINE_CHART_HEIGHT_PX,
} from "./chart-tokens";

/**
 * Loading-only silhouette. Heights are decorative and deliberately uneven so the
 * block reads as a zero-centred timeline with data still arriving; the real
 * heights come from the loader.
 */
const BUCKETS = [
  { inflow: 10, outflow: 16 },
  { inflow: 34, outflow: 44 },
  { inflow: 52, outflow: 30 },
  { inflow: 28, outflow: 58 },
  { inflow: 61, outflow: 22 },
  { inflow: 41, outflow: 49 },
  { inflow: 18, outflow: 35 },
  { inflow: 57, outflow: 66 },
  { inflow: 33, outflow: 27 },
  { inflow: 46, outflow: 40 },
  { inflow: 12, outflow: 15 },
  { inflow: 64, outflow: 52 },
  { inflow: 25, outflow: 31 },
  { inflow: 38, outflow: 45 },
  { inflow: 55, outflow: 24 },
  { inflow: 30, outflow: 60 },
  { inflow: 8, outflow: 20 },
  { inflow: 48, outflow: 37 },
  { inflow: 36, outflow: 50 },
  { inflow: 20, outflow: 71 },
] as const;

type ToneStyle = CSSProperties & { "--skeleton-color": string };

/** Muted tones: recognisable as the two directions, never mistaken for data. */
const BAR_OPACITY = "0.45";
const SWATCH_OPACITY = "0.55";

const barStyle = (height: number, color: string): ToneStyle => ({
  "--skeleton-color": color,
  blockSize: `${height}%`,
  opacity: BAR_OPACITY,
});

const swatchStyle = (color: string): CSSProperties => ({
  backgroundColor: color,
  opacity: SWATCH_OPACITY,
});

/**
 * 54% of the band equals the chart's own `scaleBand` padding of 0.4, so the
 * silhouette keeps the chart's bar rhythm and scales with the column width.
 */
const bar = css({
  borderTopRadius: "xs",
  inlineSize: "54%",
  minBlockSize: "2px",
});

const lowerBar = css({
  borderBottomRadius: "xs",
  borderTopRadius: "0",
});

const swatch = css({
  blockSize: "9px",
  clipPath: "polygon(0 0, 100% 0, 100% 68%, 68% 100%, 0 100%)",
  flexShrink: "0",
  inlineSize: "9px",
});

const legendLine = css({
  backgroundColor: "foreground",
  blockSize: "2px",
  flexShrink: "0",
  inlineSize: "18px",
  opacity: "0.35",
});

const legendChip = cx(
  bgSkeleton,
  css({ blockSize: "var(--chart-text-first-height)" })
);

const LegendItem = ({
  children,
  width,
}: {
  children: ReactNode;
  width: string;
}): ReactNode => (
  <span className={flex({ alignItems: "center", gap: "2" })}>
    {children}
    <span className={legendChip} style={{ inlineSize: width }} />
  </span>
);

/**
 * One period: received above the zero line, sent below it, at the chart's own bar
 * width so the silhouette matches the timeline instead of the old paired bars.
 */
const BucketSilhouette = ({
  inflow,
  outflow,
}: {
  inflow: number;
  outflow: number;
}): ReactNode => (
  <div className={css({ blockSize: "full", flex: "1", minInlineSize: "0" })}>
    <div
      className={flex({
        alignItems: "end",
        blockSize: "50%",
        justify: "center",
      })}
    >
      <span
        className={cx(bgSkeleton, bar)}
        style={barStyle(inflow, INFLOW_FILL)}
      />
    </div>
    <div
      className={flex({
        alignItems: "start",
        blockSize: "50%",
        justify: "center",
      })}
    >
      <span
        className={cx(bgSkeleton, bar, lowerBar)}
        style={barStyle(outflow, OUTFLOW_FILL)}
      />
    </div>
  </div>
);

/**
 * Loading silhouette for the money timeline: a zero-centred band of thin
 * inflow/outflow strokes, so the block reads as the chart it replaces rather
 * than as a generic grey panel.
 */
const MoneyTimelineSkeleton = (): ReactNode => (
  <ViewTransition
    {...viewTransitionPage}
    name={chromeViewTransitionName.hostChart}
  >
    <div
      aria-hidden="true"
      className={cx(moneyChartClassName, css({ marginBlockStart: "5" }))}
    >
      <div className={legendChip} style={{ inlineSize: "2rem" }} />

      {/*
       * Equal-flex buckets rather than a generated grid template: Panda needs a
       * literal for `repeat()`, and the bucket count stays data-driven here.
       */}
      <div
        className={flex({
          alignItems: "stretch",
          marginBlockStart: "3",
          position: "relative",
        })}
        style={{ blockSize: `${TIMELINE_CHART_HEIGHT_PX}px` }}
      >
        {BUCKETS.map((bucket, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed decorative silhouette
          <BucketSilhouette key={index} {...bucket} />
        ))}

        <span
          className={css({
            borderBlockEnd: "1px solid",
            borderColor: "border.subtle",
            insetBlockStart: "50%",
            insetInline: "0",
            position: "absolute",
          })}
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
          css({
            borderBlockStart: "1px solid",
            borderColor: "border.subtle",
            marginBlockStart: "1",
            paddingBlockStart: "3",
          })
        )}
      >
        <LegendItem width="5.5rem">
          <span className={swatch} style={swatchStyle(INFLOW_FILL)} />
        </LegendItem>
        <LegendItem width="4.5rem">
          <span className={swatch} style={swatchStyle(OUTFLOW_FILL)} />
        </LegendItem>
        <LegendItem width="7rem">
          <span className={legendLine} />
        </LegendItem>
      </div>
    </div>
  </ViewTransition>
);

export { MoneyTimelineSkeleton };
