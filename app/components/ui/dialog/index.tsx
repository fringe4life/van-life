import type { ComponentProps } from "react";

import { css, cx } from "styled-system/css";

const dialogBase = css({
  _backdrop: {
    _open: {
      backgroundColor: "accent",
    },
    transitionBehavior: "allow-discrete",
    transitionDuration: "var(--duration-dialog)",
    transitionProperty: "background-color,display,overlay",
    transitionTimingFunction: "glide",
  },
  _open: {
    opacity: "1",
  },
  _starting: {
    _open: {
      opacity: "1",
    },
    opacity: "0",
  },
  maxBlockSize: "none",
  opacity: "0",
  outline: "none",
  transitionBehavior: "allow-discrete",
  transitionDuration: "var(--duration-dialog)",
  transitionProperty: "opacity,translate,display,overlay",
  transitionTimingFunction: "glide",
});

// Top-level `css()` bindings — transform folds these; object-literal values do not.
// Always `_backdrop` — bare `backdrop:` is a non-condition nest and silently
// bails the Panda source transform (https://github.com/chakra-ui/panda/issues/3853).
const dialogFullscreen = css({
  _backdrop: {
    backgroundColor: "transparent",
  },
  _open: {
    _backdrop: {
      backgroundColor: "surface.inverse/60",
    },
  },
  backgroundColor: "transparent",
  blockSize: "full",
  inlineSize: "full",
  inset: "0",
  margin: "0",
  maxBlockSize: "none",
  maxInlineSize: "none",
  overflow: "clip",
  padding: "0",
  position: "fixed",
});

const dialogPanel = css({
  _open: {
    _backdrop: {
      backgroundColor: "surface.inverse/40",
    },
    _starting: {
      backgroundColor: "transparent",
      translate: "0 -1rem",
    },
    translate: "0 0",
  },
  blockSize: "full",
  inlineSize: "full",
  margin: "auto",
  maxInlineSize: "sm",
  padding: "4",
  rounded: "xl",
  shadow: "md",
  translate: "0 -1rem",
});

/**
 * Workaround: top-level `css()` variant map instead of `cva` — open
 * `dialogVariants({ variant })` would keep residual recipe + unused
 * `.raw`/`config` (same dual-API gap as button).
 *
 * @remarks
 * Still required on `@pandacss/vite@2.0.0` / `@pandacss/dev@2.0.0`.
 * No upstream issue yet for unused-`.raw` residual emit. Drop when Panda
 * ships string-only residual recipes; re-verify layout chunk after clean
 * `styled-system` + `build`.
 *
 * @see https://github.com/fringe4life/van-life/issues/270 — tracking
 */
const dialogByVariant = {
  fullscreen: dialogFullscreen,
  panel: dialogPanel,
} as const;

type DialogVariant = keyof typeof dialogByVariant;

type DialogProps = ComponentProps<"dialog"> & {
  variant?: DialogVariant;
};

/**
 * Consumers must scope layout display utilities to the open state (`open:flex`,
 * `open:grid`, etc.). An unconditional display utility overrides the native
 * closed dialog's `display: none` behavior and makes it visible while closed.
 */
function Dialog({
  className,
  variant = "panel",
  closedby = "any",
  ...props
}: DialogProps) {
  return (
    <dialog
      className={cx(dialogBase, dialogByVariant[variant], className)}
      {...props}
      closedby={closedby}
      // Native showModal / invokers set the `open` content attr before hydrate.
      // React VDOM has no `open`; `open={false}` would slam a live modal shut.
      suppressHydrationWarning
    />
  );
}

export { Dialog };
