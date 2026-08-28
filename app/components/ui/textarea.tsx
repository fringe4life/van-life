import type { ComponentProps } from "react";

import { cn } from "~/utils/utils";

const Textarea = ({ className, ...props }: ComponentProps<"textarea">) => (
  <textarea
    className={cn(
      "field-sizing-content flex min-h-16 w-full rounded-md border border-input bg-input-background px-3 py-2 text-base text-input-foreground shadow-xs outline-none transition-[color,box-shadow] placeholder:text-neutral-400 focus-visible:border-neutral-600 focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      className
    )}
    {...props}
  />
);

export { Textarea };
