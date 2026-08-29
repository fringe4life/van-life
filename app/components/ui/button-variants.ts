import { cva, type VariantProps } from "cva";

export const buttonVariants = cva({
  base: "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm outline-none transition-all focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  defaultVariants: {
    size: "default",
    variant: "default",
  },

  variants: {
    size: {
      default: "h-9 px-4 py-2 has-[>svg]:px-3",
      icon: "size-9",
      lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
      sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
    },
    variant: {
      default:
        "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
      destructive:
        "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90 focus-visible:bg-destructive/20",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "underline-offset-4 hover:underline",
      outline:
        "border border-foreground bg-card text-card-foreground shadow-xs hover:border-foreground/90",
      secondary:
        "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
    },
  },
});

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
