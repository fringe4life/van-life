import type { ComponentProps } from "react";
import { css, cx } from "../../../styled-system/css";

const Input = ({ className, type, ...props }: ComponentProps<"input">) => (
  <input
    className={cx(
      css({
        _disabled: {
          cursor: "not-allowed",
          opacity: 0.5,
          pointerEvents: "none",
        },
        _file: {
          background: "transparent",
          blockSize: "7",
          borderWidth: "0",
          color: "muted.foreground",
          fontSize: "sm",
          fontWeight: "medium",
        },
        _placeholder: { color: "placeholder" },
        backgroundColor: "input.background",
        blockSize: "9",
        borderColor: "input",
        borderRadius: "md",
        borderStyle: "solid",
        borderWidth: "1",
        color: "input.foreground",
        display: { _file: "inline-flex", base: "flex" },
        focusRingColor: "ring",
        focusRingOffset: "0",
        focusRingWidth: "2px",
        focusVisibleRing: "outside",
        fontSize: { md: "sm" },
        inlineSize: "full",
        minInlineSize: "0",
        outline: "none",
        paddingBlock: "1",
        paddingInline: "3",
        transitionDuration: "normal",
        transitionProperty: "color",
      }),
      className
    )}
    type={type}
    {...props}
  />
);

export { Input };
