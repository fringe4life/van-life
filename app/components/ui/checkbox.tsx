import type { ComponentProps } from "react";

import { cn } from "~/utils/utils";

function Checkbox({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "shrink-0 rounded-[4px] border border-neutral-600 accent-orange-600 accent-primarysize-4",
        className
      )}
      {...props}
      type="checkbox"
    />
  );
}

export { Checkbox };
