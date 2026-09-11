import type { DetailedHTMLProps, HTMLAttributes } from "react";
import "react";

declare global {
  interface HTMLElementTagNameMap {
    selectedcontent: HTMLElement;
  }
}

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
    popovertarget?: string;
    popovertargetaction?: "toggle" | "show" | "hide";
  }

  // biome-ignore lint/style/noNamespace: React JSX.IntrinsicElements is the supported custom-element augmentation
  namespace JSX {
    interface IntrinsicElements {
      selectedcontent: DetailedHTMLProps<
        HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}
