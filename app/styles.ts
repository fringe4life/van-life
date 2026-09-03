import { css } from "styled-system/css";
import { grid } from "styled-system/patterns";

const gridMax = grid({
  "--_gap": "2rem",
  "--_max-columns": 2,
  "--_min-column-size": "300px",
  gap: "var(--_gap)",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(min(max(var(--_min-column-size), calc((100% - var(--_gap) * var(--_max-columns)) / var(--_max-columns))), 100%), 1fr))",
});

const fullBleed = css({
  inlineSize: "calc(100% + (2 * {spacing.padding-inline}))",
  marginInlineEnd: "-padding-inline",
  marginInlineStart: "-padding-inline",
});

const fullLayout = css({
  inlineSize: "calc(100% + (2 * {spacing.padding-inline}))",
  marginInlineEnd: "-padding-inline",
  marginInlineStart: "-padding-inline",
  paddingInlineEnd: "padding-inline",
  paddingInlineStart: "padding-inline",
});

const bgSkeleton = css({
  "--_sk-color": "var(--skeleton-color, {colors.skeleton})",
  animationDuration: "2s",
  animationIterationCount: "infinite",
  animationName: "shimmer",
  animationTimingFunction: "linear",
  backgroundColor: "var(--_sk-color)",
  backgroundImage:
    "linear-gradient(90deg, var(--_sk-color) 25%, var(--skeleton-highlight, {colors.skeleton.highlight}) 50%, var(--_sk-color) 75%)",
  backgroundSize: "200% 100%",
});

export { bgSkeleton, fullBleed, fullLayout, gridMax };
