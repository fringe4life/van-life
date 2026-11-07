import { css } from "styled-system/css/css";
import { cx } from "styled-system/css/cx";

type BadgeSize = "default" | "small";
type BadgeVariant =
  | "IN_REPAIR"
  | "LUXURY"
  | "NEW"
  | "outline"
  | "RUGGED"
  | "SIMPLE"
  | "unavailable";

interface BadgeVariantProps {
  size?: BadgeSize;
  variant?: BadgeVariant;
}

const badgeBase = css({
  "& > svg": {
    aspectRatio: "1",
    inlineSize: "3",
    pointerEvents: "none",
  },
  alignItems: "center",
  borderRadius: "md",
  display: "inline-flex",
  flexShrink: "0",
  focusRingColor: "ring",
  focusRingOffset: "0",
  focusRingWidth: "2px",
  focusVisibleRing: "outside",
  fontSize: "xs",
  fontWeight: "medium",
  gap: "1",
  inlineSize: "fit-content",
  justifyContent: "center",
  overflow: "hidden",
  whiteSpace: "nowrap",
});

const badgeBySize = {
  default: css({
    paddingBlock: "2",
    paddingInline: "4",
  }),
  small: css({
    paddingBlock: "1",
    paddingInline: "2",
  }),
} as const satisfies Record<BadgeSize, string>;

/**
 * Workaround: top-level `css()` maps instead of `cva` so open
 * `badgeVariants({ size, variant })` does not pull the full recipe runtime
 * into the client bundle (#471 / #269).
 *
 * @remarks
 * Still required on `@pandacss/vite@2.4.0` / `@pandacss/dev@2.4.0`.
 * Drop when Panda emits string-only residual recipes; re-verify no `cva-*.js`
 * after clean `styled-system` + `build`.
 *
 * @see https://github.com/fringe4life/van-life/issues/471 — tracking
 */
const badgeByVariant = {
  IN_REPAIR: css({
    backgroundColor: "status.repair",
    color: "status.repair.foreground",
  }),
  LUXURY: css({
    backgroundColor: "secondary",
    color: "secondary.foreground",
  }),
  NEW: css({
    backgroundColor: "status.new",
    color: "status.new.foreground",
  }),
  outline: css({
    backgroundColor: "surface.muted",
    color: "foreground",
  }),
  RUGGED: css({
    backgroundColor: "type.rugged",
    color: "type.rugged.foreground",
  }),
  SIMPLE: css({
    backgroundColor: "type.simple",
    color: "type.simple.foreground",
  }),
  unavailable: css({
    backgroundColor: "status.unavailable",
    color: "status.unavailable.foreground",
    cursor: "not-allowed",
  }),
} as const satisfies Record<BadgeVariant, string>;

function badgeVariants({
  size = "default",
  variant = "outline",
}: BadgeVariantProps = {}) {
  return cx(badgeBase, badgeBySize[size], badgeByVariant[variant]);
}

export { type BadgeVariantProps, badgeVariants };
