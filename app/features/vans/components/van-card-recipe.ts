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
      new: "border-2 border-van-new bg-van-new/10",
      repair: "border-2 border-van-repair bg-van-repair/10",
      sale: "border-2 border-van-sale bg-van-sale/10",
    } satisfies Record<LowercaseVanState, string>,
  },
});

export { vanCard };
