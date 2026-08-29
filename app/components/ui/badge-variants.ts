import { cva, type VariantProps } from "cva";

export const badgeVariants = cva({
  base: "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-md font-medium text-xs transition-opacity focus-visible:border-destructive/50 focus-visible:ring-[3px] [&>svg]:pointer-events-none [&>svg]:size-3",
  defaultVariants: {
    size: "default",
    variant: "outline",
  },
  variants: {
    size: {
      default: "px-4 py-2",
      small: "px-1 py-0.5",
    },
    variant: {
      luxury: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
      new: "bg-status-new text-status-new-foreground hover:bg-status-new/90",
      outline: "bg-surface-muted text-foreground hover:bg-surface-accent",
      repair:
        "bg-status-repair text-status-repair-foreground hover:bg-status-repair/90",
      rugged:
        "bg-type-rugged text-type-rugged-foreground hover:bg-type-rugged/90 focus-visible:ring-type-rugged/20",
      sale: "bg-status-sale text-status-sale-foreground hover:bg-status-sale/90",
      simple:
        "bg-type-simple text-type-simple-foreground hover:bg-type-simple/90",
      unavailable:
        "disabled cursor-not-allowed bg-status-unavailable text-status-unavailable-foreground hover:bg-status-unavailable/90",
    },
  },
});

export type BadgeVariantProps = VariantProps<typeof badgeVariants>;
