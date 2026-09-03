import { css, cx } from "styled-system/css";
import { flex } from "styled-system/patterns";
import { bgSkeleton } from "~/styles";
import { barHeight } from "./styles";

const BarChartSkeleton = () => (
  <div
    className={css({
      blockSize: "full",
      inlineSize: "full",
      viewTransitionName: "host-chart",
    })}
  >
    {/* Chart area with 6 bars using CSS pseudo-random heights via custom properties */}
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
          "&>div:nth-child(1)": {
            "--bar-index": 1,
          },
          "&>div:nth-child(2)": {
            "--bar-index": 2,
          },
          "&>div:nth-child(3)": {
            "--bar-index": 3,
          },
          "&>div:nth-child(4)": {
            "--bar-index": 4,
          },
          "&>div:nth-child(5)": {
            "--bar-index": 5,
          },
          "&>div:nth-child(6)": {
            "--bar-index": 6,
          },
          blockSize: "var(--chart-content-height)",
          paddingInline: "4",
        })
      )}
    >
      <div
        className={cx(
          barHeight,
          css({ borderTopRadius: "xs", inlineSize: "12.5%" }),
          bgSkeleton
        )}
      />
      <div
        className={cx(
          barHeight,
          css({ borderTopRadius: "xs", inlineSize: "12.5%" }),
          bgSkeleton
        )}
      />
      <div
        className={cx(
          barHeight,
          css({ borderTopRadius: "xs", inlineSize: "12.5%" }),
          bgSkeleton
        )}
      />
      <div
        className={cx(
          barHeight,
          css({ borderTopRadius: "xs", inlineSize: "12.5%" }),
          bgSkeleton
        )}
      />
      <div
        className={cx(
          barHeight,
          css({ borderTopRadius: "xs", inlineSize: "12.5%" }),
          bgSkeleton
        )}
      />
      <div
        className={cx(
          barHeight,
          css({ borderTopRadius: "xs", inlineSize: "12.5%" }),
          bgSkeleton
        )}
      />
    </div>

    {/* Text area using CSS custom properties for consistent sizing */}
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
            inlineSize: "3/4",
            marginBlockEnd: "var(--chart-text-gap)",
          }),
          bgSkeleton
        )}
      />

      <div
        className={cx(
          css({
            blockSize: "var(--chart-text-second-height)",
            inlineSize: "1/2",
          }),
          bgSkeleton
        )}
      />
    </div>
  </div>
);

export { BarChartSkeleton };
