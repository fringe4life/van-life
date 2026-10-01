import { cva } from "styled-system/css";
import type { ListingChrome } from "~/features/vans/types";

const vanCardStateVariants = {
  AVAILABLE: {
    outline: "none",
  },
  IN_REPAIR: {
    backgroundColor: "status.repair/10",
    borderColor: "status.repair",
    borderStyle: "solid",
    borderWidth: "2",
  },
  NEW: {
    backgroundColor: "status.new/10",
    borderColor: "status.new",
    borderStyle: "solid",
    borderWidth: "2",
  },
  ON_SALE: {
    backgroundColor: "status.sale/10",
    borderColor: "status.sale",
    borderStyle: "solid",
    borderWidth: "2",
  },
} as const satisfies Record<ListingChrome, Record<string, unknown>>;

const vanCard = cva({
  defaultVariants: {
    state: "AVAILABLE",
  },
  variants: {
    state: vanCardStateVariants,
  },
});

export { vanCard };
