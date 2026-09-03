import type { ComponentProps } from "react";
import { cx } from "styled-system/css";
import { type BadgeVariantProps, badgeVariants } from "./badge-variants";

function Badge({
  className,
  variant = "outline",
  size = "default",
  ...props
}: ComponentProps<"span"> & BadgeVariantProps) {
  return (
    <span
      className={cx(badgeVariants({ size, variant }), className)}
      {...props}
    />
  );
}

export { Badge };
