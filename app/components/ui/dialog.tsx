import type { ComponentProps } from "react";

import { cva, cx, type RecipeVariantProps } from "../../../styled-system/css";

const dialogVariants = cva({
  base: {
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
  },
  variants: {
    variant: {
      fullscreen: {
        _open: {
          _backdrop: {
            backgroundColor: "surface.inverse/60",
          },
        },
        backdrop: {
          backgroundColor: "transparent",
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
      },
      panel: {
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
      },
    },
  },
});

type DialogProps = ComponentProps<"dialog"> &
  RecipeVariantProps<typeof dialogVariants>;

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
      className={cx(dialogVariants({ variant }), className)}
      {...props}
      closedby={closedby}
      // Native showModal / invokers set the `open` content attr before hydrate.
      // React VDOM has no `open`; `open={false}` would slam a live modal shut.
      suppressHydrationWarning
    />
  );
}

export { Dialog };
