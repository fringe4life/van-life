import { css, cx } from "styled-system/css";

type ButtonSize = "default" | "icon" | "lg" | "sm";
type ButtonVariant =
  | "default"
  | "destructive"
  | "ghost"
  | "link"
  | "outline"
  | "secondary";

interface ButtonVariantProps {
  size?: ButtonSize;
  variant?: ButtonVariant;
}

const buttonBase = css({
  _disabled: {
    cursor: "not-allowed",
    opacity: 0.5,
    pointerEvents: "none",
  },
  "& > svg": {
    flexShrink: "0",
    pointerEvents: "none",
  },
  "& > svg:not([class*='size-'])": {
    blockSize: "4",
    inlineSize: "4",
  },
  alignItems: "center",
  borderRadius: "md",
  display: "inline-flex",
  flexShrink: "0",
  focusRingColor: "ring",
  focusRingOffset: "0",
  focusRingWidth: "2px",
  focusVisibleRing: "outside",
  fontSize: "sm",
  fontWeight: "medium",
  gap: "2",
  justifyContent: "center",
  outline: "none",
  transitionDuration: "normal",
  transitionProperty: "all",
  whiteSpace: "nowrap",
});

const buttonBySize = {
  default: css({
    "&:has(> svg)": {
      paddingInline: "3",
    },
    blockSize: "9",
    paddingBlock: "2",
    paddingInline: "4",
  }),
  icon: css({
    blockSize: "9",
    inlineSize: "9",
  }),
  lg: css({
    "&:has(> svg)": {
      paddingInline: "4",
    },
    blockSize: "10",
    borderRadius: "md",
    paddingInline: "6",
  }),
  sm: css({
    "&:has(> svg)": {
      paddingInline: "2",
    },
    blockSize: "8",
    gap: "2",
    paddingInline: "3",
  }),
} as const satisfies Record<ButtonSize, string>;

const buttonByVariant = {
  default: css({
    backgroundColor: { _hover: "primary/90", base: "primary" },
    color: "primary.foreground",
    shadow: "xs",
  }),
  destructive: css({
    backgroundColor: {
      _focusVisible: "destructive/20",
      _hover: "destructive/90",
      base: "destructive",
    },
    color: "destructive.foreground",
    shadow: "xs",
  }),
  ghost: css({
    _hover: {
      backgroundColor: "accent",
      color: "accent.foreground",
    },
  }),
  link: css({
    _hover: {
      textDecoration: "underline",
      textUnderlineOffset: "4",
    },
  }),
  outline: css({
    backgroundColor: "card",
    borderColor: { _hover: "foreground/90", base: "foreground" },
    borderWidth: "1",
    color: "card.foreground",
    shadow: "xs",
  }),
  secondary: css({
    backgroundColor: { _hover: "secondary/80", base: "secondary" },
    color: "secondary.foreground",
    shadow: "xs",
  }),
} as const satisfies Record<ButtonVariant, string>;

/**
 * Workaround: top-level `css()` maps instead of `cva` so open-props
 * `buttonVariants({ size, variant })` does not keep a residual recipe with
 * unused `.raw` / `merge` / style-object `config` (~7.8KB dual emit).
 *
 * @remarks
 * Still required on `@pandacss/vite@2.0.0` / `@pandacss/dev@2.0.0` (and
 * `@pandacss/transformer@2.0.0`). No upstream issue yet — residual runtime
 * `cva` keeps `.raw`+`config` even when app never calls `.raw`. Drop when
 * Panda emits string-only residual recipes (`__pcva` without unused `.raw`);
 * re-verify button chunk after clean `styled-system` + `build`.
 *
 * @see https://github.com/fringe4life/van-life/issues/270 — tracking
 */
function buttonVariants({
  size = "default",
  variant = "default",
}: ButtonVariantProps = {}) {
  return cx(buttonBase, buttonBySize[size], buttonByVariant[variant]);
}

export { type ButtonVariantProps, buttonVariants };
