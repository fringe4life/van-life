import type { ReactNode } from "react";
import { ViewTransition } from "react";
import { css, cx } from "styled-system/css";
import { money } from "~/components/ui/figures";
import { chromeViewTransitionName } from "~/components/view-transition-names";
import { viewTransitionShare } from "~/components/view-transition-share";
import { displayPrice } from "~/features/vans/utils/display-price";
import { DirectionSwatch } from "./direction-swatch";

const ledger = css({
  "@activity/2xl": {
    alignItems: "end",
    columnGap: "10",
    gridTemplateColumns: "minmax(0, 1fr) auto auto",
  },
  alignItems: "stretch",
  borderBlock: "1px solid",
  borderColor: "border.subtle",
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  marginBlockStart: "5",
  paddingBlock: "4",
  rowGap: "3",
});

const termLabel = css({
  alignItems: "center",
  color: "muted.foreground",
  display: "flex",
  fontSize: "xs",
  gap: "2",
});

const netValue = cx(
  money,
  css({
    fontSize: { "@activity/2xl": "5xl", base: "4xl" },
    // `bold` is the heaviest Space Mono ships; there is no 800 to ask for.
    fontWeight: "bold",
    letterSpacing: "tighter",
    lineHeight: "1.05",
    margin: "0",
  })
);

const item = css({
  "@activity/2xl": {
    borderInlineStart: "1px solid",
    display: "block",
    paddingInlineStart: "7",
    textAlign: "end",
  },
  alignItems: "baseline",
  borderColor: "border.subtle",
  display: "flex",
  justifyContent: "space-between",
});

const itemTerm = css({
  "@activity/2xl": { justifyContent: "flex-end", marginBlockEnd: "1.5" },
  marginBlockEnd: "0",
});

const itemValue = cx(
  money,
  css({
    fontSize: { "@activity/2xl": "lg", base: "base" },
    fontWeight: "bold",
    margin: "0",
  })
);

interface MoneyLedgerProps {
  inflow: number;
  inflowLabel: string;
  net: number;
  /** Always names the rail: "Net, rentals" / "Net, wallet". Vocabulary: #404. */
  netLabel: string;
  outflow: number;
  outflowLabel: string;
}

/**
 * Totals strip above the timeline. The net figure carries the page's headline
 * number, so it keeps the view-transition name the route used to own.
 */
const MoneyLedger = ({
  inflow,
  inflowLabel,
  net,
  netLabel,
  outflow,
  outflowLabel,
}: MoneyLedgerProps): ReactNode => (
  <dl className={ledger}>
    <div className={css({ minInlineSize: "0" })}>
      <dt className={cx(termLabel, css({ marginBlockEnd: "1.5" }))}>
        {netLabel}
      </dt>
      <ViewTransition
        {...viewTransitionShare}
        name={chromeViewTransitionName.moneyNet}
      >
        <dd className={netValue}>{displayPrice(net)}</dd>
      </ViewTransition>
    </div>

    <div className={item}>
      <dt className={cx(termLabel, itemTerm)}>
        <DirectionSwatch direction="in" />
        {inflowLabel}
      </dt>
      <ViewTransition
        {...viewTransitionShare}
        name={chromeViewTransitionName.moneyInflow}
      >
        <dd className={itemValue}>{displayPrice(inflow)}</dd>
      </ViewTransition>
    </div>

    <div className={item}>
      <dt className={cx(termLabel, itemTerm)}>
        <DirectionSwatch direction="out" />
        {outflowLabel}
      </dt>
      <ViewTransition
        {...viewTransitionShare}
        name={chromeViewTransitionName.moneyOutflow}
      >
        <dd className={itemValue}>{displayPrice(-outflow)}</dd>
      </ViewTransition>
    </div>
  </dl>
);

export { MoneyLedger };
