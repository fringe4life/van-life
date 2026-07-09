import { cva, type VariantProps } from "cva";

export const badgeVariants = cva({
  base: "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-md font-medium text-xs transition-opacity focus-visible:border-red-500/50 focus-visible:ring-[3px] [&>svg]:pointer-events-none [&>svg]:size-3",
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
      luxury: "bg-neutral-900 text-white hover:bg-neutral-900/90",
      new: "bg-gray-500 text-white hover:bg-gray-500/90",
      outline: "bg-orange-100 hover:bg-orange/80",
      repair: "bg-yellow-500 text-black hover:bg-yellow-500/90",
      rugged:
        "bg-teal-800 text-white hover:bg-teal-800/90 focus-visible:ring-teal-800/20",
      sale: "bg-green-500 text-white hover:bg-green-500/90",
      simple: "bg-orange-600 text-white hover:bg-orange-600/90",
      unavailable:
        "disabled cursor-not-allowed bg-red-500 text-white hover:bg-red-500/90",
    },
  },
});

export type BadgeVariantProps = VariantProps<typeof badgeVariants>;
