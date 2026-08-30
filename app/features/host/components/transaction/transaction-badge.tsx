import { cva } from "cva";
import {
  ArrowDownLeft,
  ArrowDownToLine,
  ArrowUpFromLine,
  RotateCcw,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { TransactionType } from "~/db/enums";
import { transactionMeta } from "./transaction-recipe";

const transactionBadge = cva({
  base: "rounded-full border px-2.5 py-1 font-semibold text-foreground text-xs",
  defaultVariants: {
    type: TransactionType.RENTAL_PAYMENT,
  },
  variants: {
    type: {
      [TransactionType.DEPOSIT]: "border-border-accent bg-surface-accent",
      [TransactionType.RENTAL_PAYMENT]: "border-primary/50 bg-primary/10",
      [TransactionType.RENTAL_RETURN]: "border-secondary/35 bg-secondary/5",
      [TransactionType.WITHDRAW]: "border-border-strong bg-surface-muted",
    } satisfies Record<TransactionType, string>,
  },
});

const transactionIcons = {
  [TransactionType.DEPOSIT]: ArrowDownToLine,
  [TransactionType.RENTAL_PAYMENT]: ArrowDownLeft,
  [TransactionType.RENTAL_RETURN]: RotateCcw,
  [TransactionType.WITHDRAW]: ArrowUpFromLine,
} satisfies Record<TransactionType, typeof ArrowDownLeft>;

interface TransactionBadgeProps {
  type: TransactionType;
}

const TransactionBadge = ({ type }: TransactionBadgeProps) => {
  const Icon = transactionIcons[type];
  const { label } = transactionMeta[type];

  return (
    <Badge
      className={transactionBadge({ type })}
      size="small"
      title={label}
      variant="outline"
    >
      <Icon aria-hidden="true" className="size-3.5 shrink-0 text-foreground" />
      {label}
    </Badge>
  );
};

export { TransactionBadge };
