import type { ReactNode } from "react";
import { ViewTransition } from "react";
import { href } from "react-router";
import { css, cx } from "styled-system/css";
import { flex, grid, gridItem } from "styled-system/patterns";
import { ArrowRightIcon } from "~/components/icons/arrow-right-icon";
import { CustomLink } from "~/components/links/custom-link";
import { money } from "~/components/ui/figures";
import { chromeViewTransitionName } from "~/components/view-transition-names";
import { viewTransitionShare } from "~/components/view-transition-share";
import { displayPrice } from "~/features/vans/utils/display-price";
import type { Maybe } from "~/types";
import { RentalSplitBar } from "./rental-split-bar";

interface HostIncomeSectionProps {
  earnedAsHost: number;
  isBalancePending: boolean;
  name: Maybe<string>;
  optimisticBalance: number;
  paidAsRenter: number;
  sumIncome: number;
}

const tier = css({
  backgroundColor: "surface.muted",
  paddingBlockEnd: "5",
  paddingBlockStart: "8",
  paddingInline: { "@summary/4xl": "12", base: "6" },
});

const header = flex({
  alignItems: "baseline",
  flexWrap: "wrap",
  gap: "4",
  justifyContent: "space-between",
});

const greeting = css({
  color: "foreground",
  fontSize: "2xl",
  fontWeight: "bold",
  letterSpacing: "-0.01em",
  lineHeight: "8",
  margin: "0",
});

const basis = css({
  color: "muted.foreground",
  fontSize: "sm",
  lineHeight: "5",
  margin: "0",
});

/**
 * Three steps on the band's own width (`summary`, owned by `HostSummaryBand`):
 * stacked below 36rem, two figures in one row from 36rem, and full-width
 * statement lines from 56rem. `lgTo4xl` rather than `lg` keeps the middle rule
 * bounded, so the large step never has to out-rank it in the cascade.
 */
const metrics = cx(
  grid({
    columnGap: { "@summary/lgTo4xl": "6" },
    gridTemplateAreas: {
      "@summary/4xl": '"wallet" "rentals"',
      "@summary/lgTo4xl": '"wallet rentals"',
      base: '"wallet" "rentals"',
    },
    gridTemplateColumns: {
      "@summary/4xl": "minmax(0, 1fr)",
      "@summary/lgTo4xl": "repeat(2, minmax(0, 1fr))",
      base: "minmax(0, 1fr)",
    },
  }),
  css({
    borderBlockStart: "1px solid",
    borderColor: "border.subtle",
    marginBlockStart: "6",
    paddingBlockStart: "4",
  })
);

const metric = {
  alignContent: "start",
  alignItems: { "@summary/4xl": "baseline" },
  columnGap: { "@summary/4xl": "6" },
  display: "grid",
  gridTemplateColumns: {
    "@summary/4xl": "minmax(0, 1fr) auto",
    base: "minmax(0, 1fr)",
  },
} as const;

const walletMetric = gridItem({
  ...metric,
  gridArea: "wallet",
  gridTemplateAreas: {
    "@summary/4xl": '"label amount"',
    base: '"label" "amount"',
  },
});

const rentalsMetric = gridItem({
  ...metric,
  borderBlockStartWidth: {
    "@summary/4xl": "1",
    "@summary/lgTo4xl": "0",
    base: "1",
  },
  borderColor: "border.subtle",
  borderInlineStartWidth: {
    "@summary/4xl": "0",
    "@summary/lgTo4xl": "1",
    base: "0",
  },
  borderStyle: "solid",
  gridArea: "rentals",
  gridTemplateAreas: {
    "@summary/4xl": '"label amount" "split split"',
    base: '"label" "amount" "split"',
  },
  marginBlockStart: { "@summary/4xl": "5", "@summary/lgTo4xl": "0", base: "4" },
  paddingBlockStart: {
    "@summary/4xl": "5",
    "@summary/lgTo4xl": "0",
    base: "4",
  },
  paddingInlineStart: {
    "@summary/4xl": "0",
    "@summary/lgTo4xl": "4",
    base: "0",
  },
});

const metricLabel = css({ gridArea: "label" });

const labelLink = css({
  alignItems: "center",
  color: "foreground",
  display: "inline-flex",
  fontSize: "sm",
  fontWeight: "medium",
  gap: "1.5",
  lineHeight: "6",
});

/**
 * The arrow is the part that moves, so the arrow is the part that takes the
 * accent — the label keeps the text colour the link gives it. Its motion lives
 * in the glyph; the colour belongs here, next to the `card.foreground` it starts
 * from, so the two never have to out-rank each other in the cascade.
 */
const labelIcon = css({
  _foc: { color: "primary" },
  _hov: { color: "primary" },
  blockSize: "3.5",
  color: "muted.foreground",
  inlineSize: "3.5",
  transitionDuration: "200ms",
  transitionProperty: "color",
  transitionTimingFunction: "air",
});

/** The glyph's hover selectors read `.group`, so the anchor carries the marker. */
const GROUP_MARKER = "group";

const amount = cx(
  money,
  css({
    fontSize: { "@summary/4xl": "5xl", base: "3xl" },
    // `bold` is the heaviest cut system monos ship; there is no 800 to ask for.
    fontWeight: "bold",
    gridArea: "amount",
    justifySelf: { "@summary/4xl": "end" },
    lineHeight: "1.15",
    margin: "0",
    marginBlockStart: { "@summary/4xl": "0", base: "1" },
  })
);

const amountPending = css({ opacity: 0.75 });

/**
 * The split is a second `<dd>` for the same term: a `dt` may carry more than one
 * description, and the decomposition of the net belongs to the net rather than
 * to the group. `margin: 0` because `dd` ships an inline start margin.
 */
const splitArea = css({ gridArea: "split", margin: "0" });

const MetricLabel = ({
  children,
  to,
}: {
  children: ReactNode;
  to: string;
}): ReactNode => (
  <CustomLink className={cx(labelLink, GROUP_MARKER)} to={to}>
    {children}
    <ArrowRightIcon className={labelIcon} />
  </CustomLink>
);

/**
 * Upper tier of the dashboard summary band. Every figure here is all-time, so
 * the window is stated once in the header slot — the same slot the financial
 * routes put their own range in — instead of qualifying one number and not the
 * other (#453).
 */
const HostIncomeSection = ({
  earnedAsHost,
  isBalancePending,
  name,
  optimisticBalance,
  paidAsRenter,
  sumIncome,
}: HostIncomeSectionProps): ReactNode => {
  const hasRentals = earnedAsHost !== 0 || paidAsRenter !== 0;

  return (
    <div className={tier}>
      <div className={header}>
        <ViewTransition
          {...viewTransitionShare}
          name={chromeViewTransitionName.header}
        >
          <h2 className={greeting}>Welcome, {name ?? "User"}!</h2>
        </ViewTransition>

        <ViewTransition
          {...viewTransitionShare}
          name={chromeViewTransitionName.hostRange}
        >
          <p className={basis}>All time</p>
        </ViewTransition>
      </div>

      <dl className={metrics}>
        <div className={walletMetric}>
          <dt className={metricLabel}>
            <MetricLabel to={href("/host/wallet-activity")}>
              Wallet balance
            </MetricLabel>
          </dt>
          <ViewTransition
            {...viewTransitionShare}
            name={chromeViewTransitionName.balanceAmount}
          >
            <dd
              aria-busy={isBalancePending}
              className={cx(amount, isBalancePending && amountPending)}
            >
              {displayPrice(optimisticBalance)}
            </dd>
          </ViewTransition>
        </div>

        <div className={rentalsMetric}>
          <dt className={metricLabel}>
            <MetricLabel to={href("/host/rental-activity")}>
              Rentals, both sides
            </MetricLabel>
          </dt>
          <ViewTransition
            {...viewTransitionShare}
            name={chromeViewTransitionName.moneyNet}
          >
            <dd className={amount}>{displayPrice(sumIncome)}</dd>
          </ViewTransition>
          {hasRentals ? (
            <dd className={splitArea}>
              <RentalSplitBar
                earnedAsHost={earnedAsHost}
                paidAsRenter={paidAsRenter}
              />
            </dd>
          ) : null}
        </div>
      </dl>
    </div>
  );
};

export { HostIncomeSection };
