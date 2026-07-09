import { cva, type VariantProps } from "cva";

export const buttonVariants = cva({
  base: "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm outline-none transition-all focus-visible:ring-2 focus-visible:ring-black/80 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
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
      default: "bg-orange-400 text-white shadow-xs hover:bg-orange-400/90",
      destructive:
        "bg-red-500 text-white shadow-xs hover:bg-red-500/90 focus-visible:bg-red-500/20",
      ghost: "hover:",
      link: "underline-offset-4 hover:underline",
      outline:
        "border border-neutral-900 bg-white text-neutral-900 shadow-xs hover:border-neutral-900/90",
      secondary: "bg-neutral-900 text-white shadow-xs hover:bg-neutral-900/80",
    },
  },
});

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
