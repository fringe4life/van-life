import type { ComponentProps } from "react";

import { type ButtonVariantProps, buttonVariants } from "./button-variants";

function Button({
  className,
  variant = "default",
  size = "default",
  type = "button",
  ...props
}: ComponentProps<"button"> & ButtonVariantProps) {
  return (
    <button
      className={buttonVariants({ className, size, variant })}
      type={type}
      {...props}
    />
  );
}

export { Button };
