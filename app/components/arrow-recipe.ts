import { css } from "styled-system/css/css";
import { cx } from "styled-system/css/cx";

type ArrowDirection = "left" | "right";
type ArrowDistance = "compact" | "default";
type ArrowSize = "lg" | "md" | "sm";

interface ArrowVariantProps {
  direction?: ArrowDirection;
  distance?: ArrowDistance;
  size?: ArrowSize;
}

/**
 * Directional arrow icons inside interactive groups.
 *
 * Directions: `left` | `right`
 * Distances: `compact` | `default`
 * Sizes: `sm` | `md` | `lg`
 */
const arrowBase = css({
  // Panda emits group-hover rules after group-disabled rules. Keep disabled
  // arrows visually inert even when the pointer is over the disabled button.
  _groupDisabled: {
    color: "muted.foreground !important",
    scale: "1 !important",
    translate: "0 !important",
  },
  /*
   * Under reduced motion the arrow keeps the colour change and loses the
   * travel. The reset lives at one class and is forced: the group rules below
   * are two classes, so an unforced reset here would lose the cascade in the
   * same way a top-level `@media` does inside a glyph (see
   * `icons/arrow-right-icon.tsx`).
   */
  _red: {
    scale: "1 !important",
    translate: "0 !important",
  },
  color: "muted.foreground",
  flexShrink: 0,
  scale: "1",
  transitionDuration: "normal",
  transitionProperty: "colors,translate,scale",
  transitionTimingFunction: "glide",
  translate: "0",
});

const arrowBySize = {
  lg: css({ blockSize: "6", inlineSize: "6" }),
  md: css({ blockSize: "4", inlineSize: "4" }),
  sm: css({ blockSize: "3", inlineSize: "3" }),
} as const satisfies Record<ArrowSize, string>;

/**
 * Workaround: top-level `css()` maps instead of `cva`/`compoundVariants` so
 * open `arrowRecipe({…})` does not pull the full recipe runtime into the
 * client bundle (#471 / #269).
 *
 * @remarks
 * Still required on `@pandacss/vite@2.4.0` / `@pandacss/dev@2.4.0`.
 * Drop when Panda emits string-only residual recipes; re-verify no `cva-*.js`
 * and no `compoundVariants` in server-build after clean `styled-system` +
 * `build`.
 *
 * @see https://github.com/fringe4life/van-life/issues/471 — tracking
 */
const arrowByDirectionDistance = {
  "left-compact": css({
    _groupActive: {
      color: "primary",
      scale: "0.9",
      translate: "-0.125rem 0",
    },
    _groupFocus: {
      color: "primary",
      translate: "-0.1875rem 0",
    },
    _hov: {
      color: "primary",
      translate: "-0.1875rem 0",
    },
  }),
  "left-default": css({
    _groupActive: {
      color: "primary",
      scale: "0.9",
      translate: "-0.25rem 0",
    },
    _groupFocus: {
      color: "primary",
      translate: "-0.375rem 0",
    },
    _hov: {
      color: "primary",
      translate: "-0.375rem 0",
    },
  }),
  "right-compact": css({
    _groupActive: {
      color: "primary",
      scale: "0.9",
      translate: "0.125rem 0",
    },
    _groupFocus: {
      color: "primary",
      translate: "0.1875rem 0",
    },
    _hov: {
      color: "primary",
      translate: "0.1875rem 0",
    },
  }),
  "right-default": css({
    _groupActive: {
      color: "primary",
      scale: "0.9",
      translate: "0.25rem 0",
    },
    _groupFocus: {
      color: "primary",
      translate: "0.375rem 0",
    },
    _hov: {
      color: "primary",
      translate: "0.375rem 0",
    },
  }),
} as const;

function arrowRecipe({
  direction = "right",
  distance = "default",
  size = "md",
}: ArrowVariantProps = {}) {
  return cx(
    arrowBase,
    arrowBySize[size],
    arrowByDirectionDistance[`${direction}-${distance}`]
  );
}

export { arrowRecipe };
