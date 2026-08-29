import type { ComponentProps } from "react";

import { cn } from "~/utils/utils";

const Input = ({ className, type, ...props }: ComponentProps<"input">) => (
  <input
    className={cn(
      "flex h-9 w-full min-w-0 rounded-md border border-input bg-input-background px-3 py-1 text-input-foreground outline-none transition-[color] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-muted-foreground file:text-sm placeholder:text-placeholder disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      "focus-visible:border-input focus-visible:ring-2 focus-visible:ring-ring",
      className
    )}
    type={type}
    {...props}
  />
);

export { Input };
