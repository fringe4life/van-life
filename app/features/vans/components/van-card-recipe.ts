import { cva } from "cva";
import type { LowercaseVanState } from "../types";

const vanCard = cva({
  base: "",
  defaultVariants: {
    state: "available",
  },
  variants: {
    state: {
      available: "",
      new: "border-2 border-status-new bg-status-new/10",
      repair: "border-2 border-status-repair bg-status-repair/10",
      sale: "border-2 border-status-sale bg-status-sale/10",
    } satisfies Record<LowercaseVanState, string>,
  },
});

export { vanCard };
