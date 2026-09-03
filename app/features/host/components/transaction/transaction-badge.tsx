import {
  ArrowDownLeft,
  ArrowDownToLine,
  ArrowUpFromLine,
  RotateCcw,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { TransactionType } from "~/db/enums";
import { css, cva, cx } from "../../../../../styled-system/css";
import { square } from "../../../../../styled-system/patterns";
import { transactionMeta } from "./transaction-recipe";

const transactionBadge = cva({
  base: {
    borderRadius: "full",
    borderStyle: "solid",
    borderWidth: "1",
    color: "foreground",
    fontSize: "xs",
    fontWeight: "semibold",
    paddingBlock: "1",
    paddingInline: "2.5",
  },
  defaultVariants: {
    type: "RENTAL_PAYMENT",
  },
  variants: {
    type: {
      DEPOSIT: {
        backgroundColor: "surface.accent",
        borderColor: "border.accent",
      },
      RENTAL_PAYMENT: {
        backgroundColor: "primary/10",
        borderColor: "primary/50",
      },
      RENTAL_RETURN: {
        backgroundColor: "secondary/5",
        borderColor: "secondary/35",
      },
      WITHDRAW: {
        backgroundColor: "surface.muted",
        borderColor: "border.strong",
      },
    },
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
      <Icon
        aria-hidden="true"
        className={cx(
          square({ size: "3.5" }),
          css({ color: "foreground", flexShrink: "0" })
        )}
      />
      {label}
    </Badge>
  );
};

export { TransactionBadge };
