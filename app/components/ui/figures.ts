import { css } from "styled-system/css";

/**
 * Numeric typography for the two roles this app renders (#408, #476).
 *
 * **`money`** — a displayed currency amount. The system monospace stack
 * (`fonts.mono`): dashboard net and balance, ledger totals, a transaction row,
 * a van price. Keep prose out of a `money` element and style the suffix
 * separately — the face is for figures, not copy.
 *
 * **`tabularNums`** — any other numeral that sits in a column or updates in
 * place: counts, percentages, averages, dates, range labels. The body face
 * carries this with zero extra bytes; do not reach for a second family to
 * align statistics, because alignment is the only thing they need.
 *
 * Figures are `lining-nums tabular-nums` on purpose. Lining keeps the digits on
 * the cap line beside a label; tabular keeps columns stable, and keeps them
 * stable through the optimistic re-render of a balance.
 *
 * Weight stays local to the call site and must be `normal` or `bold` — the cuts
 * every reachable system mono actually ships. Asking for 500 or 600 rounds to
 * whichever cut is nearest while the CSS reads as something else.
 *
 * @see https://github.com/fringe4life/van-life/issues/408 — money vs statistics
 * @see https://github.com/fringe4life/van-life/issues/476 — system stacks
 */
const money = css({
  fontFamily: "mono",
  fontVariantNumeric: "lining-nums tabular-nums",
});

const tabularNums = css({
  fontVariantNumeric: "tabular-nums",
});

export { money, tabularNums };
