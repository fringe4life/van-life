import { cva } from "cva";
import { TransactionType } from "~/db/enums";

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
  base: "transaction-card grid min-w-0 @min-md/transaction:grid-cols-[minmax(0,1.4fr)_minmax(10rem,0.6fr)] grid-cols-1 items-start @min-md/transaction:items-center @min-md/transaction:gap-x-6 @min-md/transaction:gap-y-0 gap-y-4 self-start border-l-4",
  defaultVariants: {
    type: TransactionType.RENTAL_PAYMENT,
  },
  variants: {
    type: {
      [TransactionType.DEPOSIT]: "border-border-accent bg-surface-accent/40",
      [TransactionType.RENTAL_PAYMENT]: "border-primary bg-primary/10",
      [TransactionType.RENTAL_RETURN]: "border-secondary bg-secondary/5",
      [TransactionType.WITHDRAW]: "border-border-strong bg-surface-muted/50",
    } satisfies Record<TransactionType, string>,
  },
});

export { transactionCard, transactionMeta };
