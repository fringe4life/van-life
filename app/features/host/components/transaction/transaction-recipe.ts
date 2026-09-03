import { TransactionType } from "~/db/enums";
import { cva } from "../../../../../styled-system/css";

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

const transactionCard = cva({
  base: {
    alignItems: { "@transaction/sm": "center", base: "start" },
    alignSelf: "start",
    borderLeftWidth: "4",
    columnGap: { "@transaction/sm": "6" },
    display: "grid",
    gridTemplateAreas: {
      "@transaction/sm": '"details amount"',
      base: '"details" "amount"',
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
