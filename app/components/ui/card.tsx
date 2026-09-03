import type { ComponentProps } from "react";

import { css, cx } from "../../../styled-system/css";

const Card = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    className={cx(
      css({
        backgroundColor: "card",
        borderStyle: "solid",
        borderWidth: "1",
        color: "card.foreground",
        padding: "6",
        rounded: "xl",
        shadow: "sm",
      }),
      className
    )}
    {...props}
  />
);
const CardHeader = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    className={cx(css({ "&.bd-b_1": { paddingBlockEnd: "6" } }), className)}
    {...props}
  />
);
const CardTitle = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    className={cx(
      css({ fontWeight: "semibold", textAlign: "balance" }),
      className
    )}
    {...props}
  />
);
const CardDescription = ({ className, ...props }: ComponentProps<"div">) => (
  <div className={cx(css({ fontSize: "sm" }), className)} {...props} />
);

const CardContent = ({ className, ...props }: ComponentProps<"div">) => (
  <div className={cx(css({}), className)} {...props} />
);
const CardFooter = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    className={cx(css({ "&.bd-t_1": { paddingBlockStart: "6" } }), className)}
    {...props}
  />
);

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
