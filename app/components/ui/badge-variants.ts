import { cva, type RecipeVariantProps } from "../../../styled-system/css";

const badgeVariants = cva({
  base: {
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
  },
  defaultVariants: {
    size: "default",
    variant: "outline",
  },
  variants: {
    size: {
      default: {
        paddingBlock: "2",
        paddingInline: "4",
      },
      small: {
        paddingBlock: "1",
        paddingInline: "2",
      },
    },
    variant: {
      luxury: {
        backgroundColor: "secondary",
        color: "secondary.foreground",
      },
      new: {
        backgroundColor: "status.new",
        color: "status.new.foreground",
      },
      outline: {
        backgroundColor: "surface.muted",
        color: "foreground",
      },
      repair: {
        backgroundColor: "status.repair",
        color: "status.repair.foreground",
      },
      rugged: {
        backgroundColor: "type.rugged",
        color: "type.rugged.foreground",
      },
      sale: {
        backgroundColor: "status.sale",
        color: "status.sale.foreground",
      },
      simple: {
        backgroundColor: "type.simple",
        color: "type.simple.foreground",
      },
      unavailable: {
        backgroundColor: "status.unavailable",
        color: "status.unavailable.foreground",
        cursor: "not-allowed",
      },
    },
  },
});

export { badgeVariants };
export type BadgeVariantProps = RecipeVariantProps<typeof badgeVariants>;
