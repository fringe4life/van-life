import type { ReactNode } from "react";
import { cva } from "styled-system/css";
import type { MoneyDirection } from "~/features/host/utils/money-timeline";

/** Corner cut reads as a ledger slip, tying totals and legend to the bars. */
const swatch = cva({
  base: {
    blockSize: "9px",
    clipPath: "polygon(0 0, 100% 0, 100% 68%, 68% 100%, 0 100%)",
    display: "inline-block",
    flexShrink: "0",
    inlineSize: "9px",
  },
  defaultVariants: {
    direction: "in",
  },
  variants: {
    direction: {
      in: { backgroundColor: "chart.inflow" },
      out: { backgroundColor: "chart.outflow" },
    },
  },
});

const DirectionSwatch = ({
  direction,
}: {
  direction: MoneyDirection;
}): ReactNode => (
  <span
    aria-hidden="true"
    className={swatch({ direction })}
    data-direction={direction}
  />
);

export { DirectionSwatch };
