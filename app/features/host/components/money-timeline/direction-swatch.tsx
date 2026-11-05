import type { ReactNode } from "react";
import { css } from "styled-system/css";
import type { MoneyDirection } from "~/features/host/utils/money-timeline";

/** Corner cut reads as a ledger slip, tying totals and legend to the bars. */
const swatchBase = css({
  blockSize: "9px",
  clipPath: "polygon(0 0, 100% 0, 100% 68%, 68% 100%, 0 100%)",
  display: "inline-block",
  flexShrink: "0",
  inlineSize: "9px",
});

/**
 * Workaround: top-level `css()` maps instead of `cva` so open
 * `swatch({ direction })` does not pull the full recipe runtime into the
 * client bundle (#471 / #269).
 *
 * @remarks
 * Still required on `@pandacss/vite@2.4.0` / `@pandacss/dev@2.4.0`.
 * Drop when Panda emits string-only residual recipes; re-verify no `cva-*.js`
 * after clean `styled-system` + `build`.
 *
 * @see https://github.com/fringe4life/van-life/issues/471 — tracking
 */
const swatchByDirection = {
  in: css({ backgroundColor: "chart.inflow" }),
  out: css({ backgroundColor: "chart.outflow" }),
} as const satisfies Record<MoneyDirection, string>;

const DirectionSwatch = ({
  direction,
}: {
  direction: MoneyDirection;
}): ReactNode => (
  <span
    aria-hidden="true"
    className={`${swatchBase} ${swatchByDirection[direction]}`}
    data-direction={direction}
  />
);

export { DirectionSwatch };
