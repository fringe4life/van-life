import { cva } from "styled-system/css";
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

/** Rail colour reads direction; the card tint stays a type cue. */
const transactionCard = cva({
  base: {
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
  },
  defaultVariants: {
    type: "RENTAL_PAYMENT",
  },
  variants: {
    type: {
      DEPOSIT: {
        backgroundColor: "surface.accent/40",
        borderInlineStartColor: "chart.inflow",
      },
      RENTAL_PAYMENT: {
        backgroundColor: "primary/10",
        borderInlineStartColor: "chart.inflow",
      },
      RENTAL_RETURN: {
        backgroundColor: "secondary/5",
        borderInlineStartColor: "chart.outflow",
      },
      WITHDRAW: {
        backgroundColor: "surface.muted/50",
        borderInlineStartColor: "chart.outflow",
      },
    },
  },
});

export { transactionCard, transactionMeta };
