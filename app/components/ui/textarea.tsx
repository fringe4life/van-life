import type { ComponentProps } from "react";

import { css, cx } from "../../../styled-system/css";

const Textarea = ({ className, ...props }: ComponentProps<"textarea">) => (
  <textarea
    className={cx(
      css({
        _disabled: {
          cursor: "not-allowed",
          opacity: 0.5,
        },
        _placeholder: {
          color: "placeholder",
        },
        backgroundColor: "input.background",
        borderColor: "input",
        borderRadius: "md",
        borderStyle: "solid",
        borderWidth: "1",
        boxShadow: "xs",
        color: "input.foreground",
        display: "flex",
        fieldSizing: "content",
        focusRingColor: "ring",
        focusRingOffset: "0",
        focusRingWidth: "2px",
        focusVisibleRing: "outside",
        fontSize: "base",
        inlineSize: "full",
        minBlockSize: "16",
        paddingBlock: "2",
        paddingInline: "3",
        transitionDuration: "normal",
        transitionProperty: "color,box-shadow",
      }),
      className
    )}
    {...props}
  />
);

export { Textarea };
