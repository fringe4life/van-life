import type { Prettify } from "~/types";

export type NativePopoverElement = Prettify<
  HTMLElement & {
    hidePopover: () => void;
  }
>;
