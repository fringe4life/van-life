import { css } from "styled-system/css/css";
import type { ListingChrome } from "~/features/vans/types";

/**
 * Workaround: top-level `css()` maps instead of `cva` so open
 * `vanCard({ state })` does not pull the full recipe runtime into the
 * client bundle (#471 / #269).
 *
 * @remarks
 * Still required on `@pandacss/vite@2.4.0` / `@pandacss/dev@2.4.0`.
 * Drop when Panda emits string-only residual recipes; re-verify no `cva-*.js`
 * after clean `styled-system` + `build`.
 *
 * @see https://github.com/fringe4life/van-life/issues/471 — tracking
 */
const vanCardByState = {
  AVAILABLE: css({
    outline: "none",
  }),
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

function vanCard({ state = "AVAILABLE" }: { state?: ListingChrome } = {}) {
  return vanCardByState[state];
}

export { vanCard };
