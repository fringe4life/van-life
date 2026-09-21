import { type CSSProperties, type ReactNode, ViewTransition } from "react";
import { css, cx } from "styled-system/css";
import { flex } from "styled-system/patterns";
import { chromeViewTransitionName } from "~/components/view-transition-names";
import { viewTransitionPage } from "~/components/view-transition-share";
import { CHART_HEIGHT_BAND_COLORS } from "~/features/host/utils/chart-height-bands";
import { bgSkeleton } from "~/styles";
import { barHeight } from "./styles";

const SKELETON_GRID_ROWS =
  "minmax(var(--chart-legend-height), auto) minmax(0, 1fr) var(--chart-axis-height)";

type SkeletonColorStyles = CSSProperties & {
  "--skeleton-color": string;
};

interface BarChartItemProps {
  color: string;
}

const BarChartItem = ({ color }: BarChartItemProps): ReactNode => {
  const barStyle: SkeletonColorStyles = {
    "--skeleton-color": color,
  };

  return (
    <div
      aria-hidden="true"
      className={cx(
        barHeight,
        css({ borderTopRadius: "xs", inlineSize: "12.5%" }),
        bgSkeleton
      )}
      style={barStyle}
    />
  );
};

const BarChartLegendSkeleton = (): ReactNode => (
  <div
    className={css({
      gridRow: "1",
      paddingInline: "4",
    })}
  >
    <div
      aria-hidden="true"
      className={cx(
        css({
          blockSize: "var(--chart-text-first-height)",
          inlineSize: "1/8",
        }),
        bgSkeleton
      )}
    />
    <div
      className={css({
        display: "grid",
        gap: "2",
        gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
        marginBlockStart: "1",
      })}
    >
      {CHART_HEIGHT_BAND_COLORS.map((color) => {
        const itemStyle: SkeletonColorStyles = {
          "--skeleton-color": color,
        };

        return (
          <div
            aria-hidden="true"
            className={cx(
              css({
                blockSize: "var(--chart-text-first-height)",
              }),
              bgSkeleton
            )}
            key={color}
            style={itemStyle}
          />
        );
      })}
    </div>
  </div>
);

const BarChartList = (): ReactNode => (
  <div
    className={cx(
      flex({
        alignItems: "end",
        gap: "2",
        justifyContent: "space-between",
      }),
      css({
        blockSize: "full",
        gridRow: "2",
        paddingInline: "4",
      })
    )}
  >
    {CHART_HEIGHT_BAND_COLORS.map((color) => (
      <BarChartItem color={color} key={color} />
    ))}
  </div>
);

const BarChartAxisSkeleton = (): ReactNode => (
  <div
    className={cx(
      flex({
        alignItems: "center",
        justifyContent: "center",
      }),
      css({
        gridRow: "3",
        paddingInline: "4",
      })
    )}
  >
    <div
      aria-hidden="true"
      className={cx(
        css({
          blockSize: "var(--chart-text-first-height)",
          inlineSize: "4/5",
        }),
        bgSkeleton
      )}
    />
  </div>
);

const BarChartSkeleton = (): ReactNode => (
  <ViewTransition
    {...viewTransitionPage}
    name={chromeViewTransitionName.hostChart}
  >
    <div
      className={css({
        "--skeleton-highlight": "{colors.surface.accent}",
        "@media (22.5rem < width <= 30rem)": {
          "--chart-legend-height": "71px",
        },
        "@media (width <= 22.5rem)": {
          "--chart-axis-height": "22px",
          "--chart-legend-height": "90px",
        },
        blockSize: "var(--chart-height)",
        display: "grid",
        gridTemplateRows: SKELETON_GRID_ROWS,
        inlineSize: "full",
      })}
    >
      <BarChartLegendSkeleton />
      <BarChartList />
      <BarChartAxisSkeleton />
    </div>
  </ViewTransition>
);

export { BarChartSkeleton };
