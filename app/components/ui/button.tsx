import type { ComponentProps } from "react";
import { cx } from "../../../styled-system/css";
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
      className={cx(buttonVariants({ size, variant }), className)}
      type={type}
      {...props}
    />
  );
}

export { Button };
