import { type ComponentPropsWithoutRef, ViewTransition } from "react";
import { css } from "styled-system/css";
import { chromeViewTransitionName } from "~/components/view-transition-names";
import { viewTransitionShare } from "~/components/view-transition-share";

const VanHeader = ({ children }: ComponentPropsWithoutRef<"h2">) => (
  <ViewTransition
    {...viewTransitionShare}
    name={chromeViewTransitionName.header}
  >
    <h2
      className={css({
        fontSize: "3xl",
        fontWeight: "bold",
        lineHeight: "9",
      })}
    >
      {children}
    </h2>
  </ViewTransition>
);

export { VanHeader };
