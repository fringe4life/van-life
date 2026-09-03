import type { ComponentPropsWithoutRef } from "react";
import { css } from "styled-system/css";

const VanHeader = ({ children }: ComponentPropsWithoutRef<"h2">) => (
  <h2
    className={css({
      fontSize: "3xl",
      fontWeight: "bold",
      lineHeight: "9",
      viewTransitionName: "van-header",
    })}
  >
    {children}
  </h2>
);

export { VanHeader };
