import type { ComponentProps } from "react";

import { cn } from "~/utils/utils";

function Checkbox({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "size-4 shrink-0 rounded-[4px] border border-neutral-600 accent-primary",
        className
      )}
      {...props}
      type="checkbox"
    />
  );
}

export { Checkbox };
