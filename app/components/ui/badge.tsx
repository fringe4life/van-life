import type { ComponentProps } from "react";

import { type BadgeVariantProps, badgeVariants } from "./badge-variants";

function Badge({
  className,
  variant = "outline",
  size = "default",
  ...props
}: ComponentProps<"span"> & BadgeVariantProps) {
  return (
    <span className={badgeVariants({ className, size, variant })} {...props} />
  );
}

export { Badge };
