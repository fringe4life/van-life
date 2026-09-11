import { type CSSProperties, type ReactNode, ViewTransition } from "react";
import { css, cx } from "styled-system/css";
import { flex } from "styled-system/patterns";
import { chromeViewTransitionName } from "~/components/view-transition-names";
import { viewTransitionPage } from "~/components/view-transition-share";
import { bgSkeleton } from "~/styles";
import { barHeight } from "./styles";

const BAR_COUNT = 6;

type BarChartItemStyles = CSSProperties & {
  "--bar-index": number;
};

interface BarChartItemProps {
  index: number;
}

const BarChartItem = ({ index }: BarChartItemProps): ReactNode => {
  const barStyle: BarChartItemStyles = {
    "--bar-index": index,
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

const BarChartList = (): ReactNode => (
  <div
    className={cx(
      flex({
        alignItems: "end",
        gap: "2",
        justifyContent: "space-between",
      }),
      css({
        "--skeleton-color": "{colors.chart.1}",
        "--skeleton-highlight": "{colors.surface.accent}",
        blockSize: "var(--chart-content-height)",
        paddingInline: "4",
      })
    )}
  >
    {Array.from({ length: BAR_COUNT }, (_, index) => {
      const barIndex = index + 1;

      return <BarChartItem index={barIndex} key={`bar-${barIndex}`} />;
    })}
  </div>
);

const BarChartSkeleton = (): ReactNode => (
  <ViewTransition
    {...viewTransitionPage}
    name={chromeViewTransitionName.hostChart}
  >
    <div
      className={css({
        blockSize: "full",
        inlineSize: "full",
      })}
    >
      <BarChartList />
      <div
        className={css({
          marginBlockStart: "var(--chart-text-top-margin)",
          marginInline: "auto",
        })}
      >
        <div
          className={cx(
            css({
              blockSize: "var(--chart-text-first-height)",
              inlineSize: "4/5",
            }),
            bgSkeleton
          )}
        />
      </div>
    </div>
  </ViewTransition>
);

export { BarChartSkeleton };
