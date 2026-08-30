import type { ComponentProps } from "react";

import { cn } from "~/utils/utils";

function Checkbox({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "size-4 shrink-0 rounded-control border border-input accent-primary",
        className
      )}
      {...props}
      type="checkbox"
    />
  );
}

export { Checkbox };
