import { cva, type VariantProps } from "cva";
import type { ComponentProps } from "react";

import { cn } from "~/utils/utils";

const dialogVariants = cva({
  base: "max-h-none opacity-0 starting:opacity-0 outline-none transition-[opacity,translate,display,overlay] transition-discrete duration-(--duration-dialog) ease-glide backdrop:transition-[background-color,display,overlay] backdrop:transition-discrete backdrop:duration-(--duration-dialog) backdrop:ease-glide open:opacity-100",
  defaultVariants: {
    variant: "panel",
  },
  variants: {
    variant: {
      fullscreen:
        "m-0 h-full w-full max-w-none translate-x-full backdrop:bg-transparent open:starting:translate-x-full open:translate-x-0 open:bg-accent open:starting:bg-transparent open:backdrop:bg-surface-inverse/60",
      panel:
        "m-auto max-w-sm -translate-y-4 starting:-translate-y-4 rounded-xl p-4 shadow-md backdrop:bg-transparent open:translate-y-0 open:bg-accent open:starting:bg-transparent open:backdrop:bg-surface-inverse/40",
    },
  },
});

type DialogProps = ComponentProps<"dialog"> &
  VariantProps<typeof dialogVariants>;

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
      className={cn(dialogVariants({ className, variant }))}
      {...props}
      closedby={closedby}
      // Native showModal / invokers set the `open` content attr before hydrate.
      // React VDOM has no `open`; `open={false}` would slam a live modal shut.
      suppressHydrationWarning
    />
  );
}

export { Dialog };
