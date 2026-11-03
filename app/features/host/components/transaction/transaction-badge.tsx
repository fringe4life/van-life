import { cva } from "styled-system/css";
import { square } from "styled-system/patterns";
import {
  ArrowDownToLineIcon,
  ArrowUpFromLineIcon,
} from "~/components/icons/arrow-line-icon";
import type { IconComponent } from "~/components/icons/icon";
import {
  MoneyInIcon,
  MoneyOutIcon,
} from "~/components/icons/money-transfer-icon";
import { Badge } from "~/components/ui/badge";
import { TransactionType } from "~/db/enums";
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

/*
 * Vendored glyphs (#439–#442). Wallet movement is an arrow onto or off a line;
 * rental movement is one diagonal arrow with its head at either end. Each glyph
 * owns its direction tint, so the badge no longer forces a colour on the whole
 * icon: the wallet line inherits `foreground` from here, and the arrows read
 * `chart.inflow` / `chart.outflow` from `money-ink.ts`.
 */
const transactionIcons = {
  [TransactionType.DEPOSIT]: ArrowDownToLineIcon,
  [TransactionType.RENTAL_PAYMENT]: MoneyInIcon,
  [TransactionType.RENTAL_RETURN]: MoneyOutIcon,
  [TransactionType.WITHDRAW]: ArrowUpFromLineIcon,
} as const satisfies Record<TransactionType, IconComponent>;

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
      <Icon aria-hidden="true" className={square({ size: "3.5" })} />
      {label}
    </Badge>
  );
};

export { TransactionBadge };
