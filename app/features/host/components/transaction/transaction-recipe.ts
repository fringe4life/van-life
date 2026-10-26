import { cva } from "styled-system/css";
import { TransactionType } from "~/db/enums";
import type { ChartHeightBandVariant } from "~/features/host/utils/chart-height-bands";

const transactionMeta = {
  [TransactionType.DEPOSIT]: {
    label: "Deposit",
    title: "Wallet funded",
  },
  [TransactionType.RENTAL_PAYMENT]: {
    label: "Rental payment",
    title: "Payment received",
  },
  [TransactionType.RENTAL_RETURN]: {
    label: "Rental return",
    title: "Payment adjusted",
  },
  [TransactionType.WITHDRAW]: {
    label: "Withdrawal",
    title: "Payout sent",
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

const transactionCard = cva({
  base: {
    alignItems: { "@transaction/sm": "center", base: "start" },
    alignSelf: "start",
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
    heightBand: {
      five: { borderInlineStartColor: "chart.5" },
      four: { borderInlineStartColor: "chart.4" },
      one: { borderInlineStartColor: "chart.1" },
      three: { borderInlineStartColor: "chart.3" },
      two: { borderInlineStartColor: "chart.2" },
    } satisfies Record<
      ChartHeightBandVariant,
      { borderInlineStartColor: string }
    >,
    type: {
      DEPOSIT: {
        backgroundColor: "surface.accent/40",
        borderColor: "border.accent",
      },
      RENTAL_PAYMENT: {
        backgroundColor: "primary/10",
        borderColor: "primary",
      },
      RENTAL_RETURN: {
        backgroundColor: "secondary/5",
        borderColor: "secondary",
      },
      WITHDRAW: {
        backgroundColor: "surface.muted/50",
        borderColor: "border.strong",
      },
    },
  },
});

export { transactionCard, transactionMeta };
