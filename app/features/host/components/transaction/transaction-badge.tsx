import { css } from "styled-system/css/css";
import { cx } from "styled-system/css/cx";
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

/**
 * The ledger word is what makes this pill wide, and the pill shares a 149px row
 * with the title on a narrow card (#481). So the word is rendered but clipped
 * until the header row can hold both, and the padding tightens with it: the
 * pill collapses to its glyph rather than pushing the title onto a second line.
 * Padding comes back with the word, so the desktop badge is unchanged.
 */
const transactionBadgeBase = css({
  _transactionHeadWide: {
    paddingInline: "2.5",
  },
  borderRadius: "full",
  borderStyle: "solid",
  borderWidth: "1",
  color: "foreground",
  fontSize: "xs",
  fontWeight: "medium",
  paddingBlock: "1",
  paddingInline: "1.5",
});

/**
 * Visually hidden below the step, read out at every width. Clipping instead of
 * `display: none` keeps the ledger name in the article's accessible name once
 * the word itself is gone.
 */
const transactionBadgeWord = css({
  _transactionHeadWide: {
    clipPath: "none",
    height: "auto",
    margin: "0",
    overflow: "visible",
    position: "static",
    width: "auto",
  },
  clipPath: "inset(50%)",
  height: "1px",
  margin: "-1px",
  overflow: "hidden",
  position: "absolute",
  whiteSpace: "nowrap",
  width: "1px",
});

/**
 * Workaround: top-level `css()` maps instead of `cva` so open
 * `transactionBadge({ type })` does not pull the full recipe runtime into the
 * client bundle (#471 / #269).
 *
 * @remarks
 * Still required on `@pandacss/vite@2.4.0` / `@pandacss/dev@2.4.0`.
 * Drop when Panda emits string-only residual recipes; re-verify no `cva-*.js`
 * after clean `styled-system` + `build`.
 *
 * @see https://github.com/fringe4life/van-life/issues/471 — tracking
 */
const transactionBadgeByType = {
  DEPOSIT: css({
    backgroundColor: "surface.accent",
    borderColor: "border.accent",
  }),
  RENTAL_PAYMENT: css({
    backgroundColor: "primary/10",
    borderColor: "primary/50",
  }),
  RENTAL_RETURN: css({
    backgroundColor: "secondary/5",
    borderColor: "secondary/35",
  }),
  WITHDRAW: css({
    backgroundColor: "surface.muted",
    borderColor: "border.strong",
  }),
} as const satisfies Record<TransactionType, string>;

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
      className={cx(transactionBadgeBase, transactionBadgeByType[type])}
      size="small"
      title={label}
      variant="outline"
    >
      <Icon aria-hidden="true" />
      <span className={transactionBadgeWord}>{label}</span>
    </Badge>
  );
};

export { TransactionBadge };
