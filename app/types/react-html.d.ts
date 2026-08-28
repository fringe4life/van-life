import "react";

declare module "react" {
  type StandardCommand =
    | "show-modal"
    | "close"
    | "request-close"
    | "show-popover"
    | "hide-popover"
    | "toggle-popover";

  interface ButtonHTMLAttributes<T> {
    command?: StandardCommand | `--${string}`;
    commandfor?: string;
  }
}
