import type { ComponentProps } from "react";

import { css, cx } from "styled-system/css";
import { hstack } from "styled-system/patterns";

function Label({ className, ...props }: ComponentProps<"label">) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: primitive wrapper — htmlFor supplied by consumer
    <label
      className={cx(
        hstack({
          gap: "2",
          userSelect: "none",
        }),
        css({
          _groupDisabled: {
            opacity: 0.5,
            pointerEvents: "none",
          },
          _peerDisabled: {
            cursor: "not-allowed",
            opacity: 0.5,
          },
          color: "foreground",
          fontSize: "sm",
          fontWeight: "medium",
          lineHeight: "none",
        }),
        className
      )}
      {...props}
    />
  );
}

export { Label };
