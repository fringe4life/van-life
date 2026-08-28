import type { ComponentProps } from "react";

import { cn } from "~/utils/utils";

const Card = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    className={cn(
      "rounded-xl border bg-card p-6 text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
);

const CardHeader = ({ className, ...props }: ComponentProps<"div">) => (
  <div className={cn("[.border-b]:pb-6", className)} {...props} />
);

const CardTitle = ({ className, ...props }: ComponentProps<"div">) => (
  <div className={cn("text-balance font-semibold", className)} {...props} />
);

const CardDescription = ({ className, ...props }: ComponentProps<"div">) => (
  <div className={cn("text-sm", className)} {...props} />
);

const CardContent = ({ className, ...props }: ComponentProps<"div">) => (
  <div className={cn("", className)} {...props} />
);

const CardFooter = ({ className, ...props }: ComponentProps<"div">) => (
  <div className={cn("[.border-t]:pt-6", className)} {...props} />
);

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
