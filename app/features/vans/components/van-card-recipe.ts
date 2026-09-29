import { css } from "styled-system/css";
import type { ListingChrome } from "~/features/vans/types";

const vanCardByState = {
  AVAILABLE: "",
  IN_REPAIR: css({
    backgroundColor: "status.repair/10",
    borderColor: "status.repair",
    borderStyle: "solid",
    borderWidth: "2",
  }),
  NEW: css({
    backgroundColor: "status.new/10",
    borderColor: "status.new",
    borderStyle: "solid",
    borderWidth: "2",
  }),
  ON_SALE: css({
    backgroundColor: "status.sale/10",
    borderColor: "status.sale",
    borderStyle: "solid",
    borderWidth: "2",
  }),
} as const satisfies Record<ListingChrome, string>;

function vanCard({ state }: { state: ListingChrome }) {
  return vanCardByState[state];
}

export { vanCard };
