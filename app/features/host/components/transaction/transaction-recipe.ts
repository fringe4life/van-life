import { css } from "styled-system/css/css";
import { cx } from "styled-system/css/cx";
import { TransactionType } from "~/db/enums";
import { moneyLabels } from "~/features/host/utils/money-labels";

/**
 * Rail badge = which ledger; title = direction word from `moneyLabels`.
 * Vocabulary decision: #403.
 */
const transactionMeta = {
  [TransactionType.DEPOSIT]: {
    label: "Wallet",
    title: moneyLabels.wallet.inflow.card,
  },
  [TransactionType.RENTAL_PAYMENT]: {
    label: "Rental",
    title: moneyLabels.rental.inflow.card,
  },
  [TransactionType.RENTAL_RETURN]: {
    label: "Rental",
    title: moneyLabels.rental.outflow.card,
  },
  [TransactionType.WITHDRAW]: {
    label: "Wallet",
    title: moneyLabels.wallet.outflow.card,
  },
} as const satisfies Record<TransactionType, { label: string; title: string }>;

/*
 * Biome 2.6+ CSS-in-JS parse rejects quoted grid-template-areas string
 * literals inside style objects (`'"a b"'` / `` `"a b"` ``). Keep values in
 * plain consts so the CSS parser never sees them. biome-ignore cannot suppress
 * parse diagnostics.
 */
const transactionGridAreasSm = '"details amount"';
const transactionGridAreasBase = '"details" "amount"';

const transactionCardBase = css({
  alignItems: { "@transaction/sm": "center", base: "start" },
  alignSelf: "start",
  borderColor: "border.subtle",
  borderLeftWidth: "4",
  columnGap: { "@transaction/sm": "6" },
  display: "grid",
  gridTemplateAreas: {
    "@transaction/sm": transactionGridAreasSm,
    base: transactionGridAreasBase,
  },
  gridTemplateColumns: {
    "@transaction/sm": "minmax(0,1.4fr) minmax(10rem,0.6fr)",
    base: "1fr",
  },
  minInlineSize: "0",
  rowGap: { "@transaction/sm": "0", base: "4" },
});

/**
 * Workaround: top-level `css()` maps instead of `cva` so open
 * `transactionCard({ type })` does not pull the full recipe runtime into the
 * client bundle (#471 / #269).
 *
 * @remarks
 * Still required on `@pandacss/vite@2.4.0` / `@pandacss/dev@2.4.0`.
 * Drop when Panda emits string-only residual recipes; re-verify no `cva-*.js`
 * after clean `styled-system` + `build`.
 *
 * @see https://github.com/fringe4life/van-life/issues/471 — tracking
 */
const transactionCardByType = {
  DEPOSIT: css({
    backgroundColor: "surface.accent/40",
    borderInlineStartColor: "chart.inflow",
  }),
  RENTAL_PAYMENT: css({
    backgroundColor: "primary/10",
    borderInlineStartColor: "chart.inflow",
  }),
  RENTAL_RETURN: css({
    backgroundColor: "secondary/5",
    borderInlineStartColor: "chart.outflow",
  }),
  WITHDRAW: css({
    backgroundColor: "surface.muted/50",
    borderInlineStartColor: "chart.outflow",
  }),
} as const satisfies Record<TransactionType, string>;

/** Rail colour reads direction; the card tint stays a type cue. */
function transactionCard({
  type = "RENTAL_PAYMENT",
}: {
  type?: TransactionType;
} = {}) {
  return cx(transactionCardBase, transactionCardByType[type]);
}

/**
 * The line under the title. One scale for both ledgers so a wallet card and a
 * rental card stay the same height, keyed to the card (that line is the first
 * thing to wrap when the details column narrows).
 */
const transactionDetailText = css({
  fontSize: "clamp(0.8125rem, 0.75rem + 0.26cqi, 0.875rem)",
  lineHeight: "1.35",
});

export { transactionCard, transactionDetailText, transactionMeta };
