import type { ComponentProps } from "react";
import { css, cx } from "styled-system/css";

function Checkbox({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cx(
        css({
          accentColor: "primary",
          aspectRatio: "1",
          borderColor: "input",
          borderRadius: "control",
          borderStyle: "solid",
          borderWidth: "1",
          flexShrink: "0",
          inlineSize: 4,
        }),
        className
      )}
      {...props}
      type="checkbox"
    />
  );
}

export { Checkbox };
