import { cva } from "styled-system/css";

/**
 * PandaCSS CVA recipe for directional arrow icons inside interactive groups.
 *
 * Directions: `left` | `right`
 * Distances: `compact` | `default`
 * Sizes: `sm` | `md` | `lg`
 */
export const arrowRecipe = cva({
  base: {
    // Panda emits group-hover rules after group-disabled rules. Keep disabled
    // arrows visually inert even when the pointer is over the disabled button.
    _groupDisabled: {
      color: "muted.foreground !important",
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
  },
  compoundVariants: [
    {
      css: {
        _groupActive: {
          color: "primary",
          scale: "0.9",
          translate: "-0.125rem 0",
        },
        _groupFocus: {
          color: "primary",
          translate: "-0.1875rem 0",
        },
        _groupHover: {
          color: "primary",
          translate: "-0.1875rem 0",
        },
      },
      direction: "left",
      distance: "compact",
    },
    {
      css: {
        _groupActive: {
          color: "primary",
          scale: "0.9",
          translate: "-0.25rem 0",
        },
        _groupFocus: {
          color: "primary",
          translate: "-0.375rem 0",
        },
        _groupHover: {
          color: "primary",
          translate: "-0.375rem 0",
        },
      },
      direction: "left",
      distance: "default",
    },
    {
      css: {
        _groupActive: {
          color: "primary",
          scale: "0.9",
          translate: "0.125rem 0",
        },
        _groupFocus: {
          color: "primary",
          translate: "0.1875rem 0",
        },
        _groupHover: {
          color: "primary",
          translate: "0.1875rem 0",
        },
      },
      direction: "right",
      distance: "compact",
    },
    {
      css: {
        _groupActive: {
          color: "primary",
          scale: "0.9",
          translate: "0.25rem 0",
        },
        _groupFocus: {
          color: "primary",
          translate: "0.375rem 0",
        },
        _groupHover: {
          color: "primary",
          translate: "0.375rem 0",
        },
      },
      direction: "right",
      distance: "default",
    },
  ],
  defaultVariants: {
    direction: "right",
    distance: "default",
    size: "md",
  },
  variants: {
    direction: {
      left: {},
      right: {},
    },
    distance: {
      compact: {},
      default: {},
    },
    size: {
      lg: { size: 6 },
      md: { size: 4 },
      sm: { size: 3 },
    },
  },
});

// type ArrowVariantProps = NonNullable<
//   RecipeVariantProps<typeof arrowRecipe>
// >;
