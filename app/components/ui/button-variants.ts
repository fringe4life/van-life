import { cva, type RecipeVariantProps } from "../../../styled-system/css";

export const buttonVariants = cva({
  base: {
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
  },
  defaultVariants: {
    size: "default",
    variant: "default",
  },
  variants: {
    size: {
      default: {
        "&:has(> svg)": {
          paddingInline: "3",
        },
        blockSize: "9",
        paddingBlock: "2",
        paddingInline: "4",
      },
      icon: {
        blockSize: "9",
        inlineSize: "9",
      },
      lg: {
        "&:has(> svg)": {
          paddingInline: "4",
        },
        blockSize: "10",
        borderRadius: "md",
        paddingInline: "6",
      },
      sm: {
        "&:has(> svg)": {
          paddingInline: "2",
        },
        blockSize: "8",
        gap: "2",
        paddingInline: "3",
      },
    },
    variant: {
      default: {
        backgroundColor: { _hover: "primary/90", base: "primary" },
        color: "primary.foreground",
        shadow: "xs",
      },
      destructive: {
        backgroundColor: {
          _focusVisible: "destructive/20",
          _hover: "destructive/90",
          base: "destructive",
        },
        color: "destructive.foreground",
        shadow: "xs",
      },
      ghost: {
        _hover: {
          backgroundColor: "accent",
          color: "accent.foreground",
        },
      },
      link: {
        _hover: {
          textDecoration: "underline",
          textUnderlineOffset: "4",
        },
      },
      outline: {
        backgroundColor: "card",
        borderColor: { _hover: "foreground/90", base: "foreground" },
        borderWidth: "1",
        color: "card.foreground",
        shadow: "xs",
      },
      secondary: {
        backgroundColor: { _hover: "secondary/80", base: "secondary" },

        color: "secondary.foreground",
        shadow: "xs",
      },
    },
  },
});

export type ButtonVariantProps = RecipeVariantProps<typeof buttonVariants>;
