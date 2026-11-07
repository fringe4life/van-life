import type { ReactNode } from "react";
import { css } from "styled-system/css/css";
import { cx } from "styled-system/css/cx";
import { cq } from "styled-system/patterns";
import type { Maybe } from "~/types";
import { HostIncomeSection } from "./host-income-section";
import { HostReviewSection } from "./host-review-section";

interface HostSummaryBandProps {
  avgRating: number;
  earnedAsHost: number;
  isBalancePending: boolean;
  name: Maybe<string>;
  optimisticBalance: number;
  paidAsRenter: number;
  reviewCount: number;
  sumIncome: number;
}

const band = cx(
  cq({ name: "summary" }),
  css({
    borderColor: "border.subtle",
    borderStyle: "solid",
    borderWidth: "1",
    inlineSize: "full",
    overflow: "hidden",
    rounded: "xl",
  })
);

/**
 * The dashboard summary band: one sheet, two tiers, one query container.
 *
 * Both tiers reflow on the band's own width rather than the viewport, so the
 * same markup holds whether the host sidebar sits beside the content or above
 * it (#453). Steps live on the tiers; this shell only owns the sheet and the
 * container.
 */
const HostSummaryBand = ({
  avgRating,
  earnedAsHost,
  isBalancePending,
  name,
  optimisticBalance,
  paidAsRenter,
  reviewCount,
  sumIncome,
}: HostSummaryBandProps): ReactNode => (
  <div className={band}>
    <HostIncomeSection
      earnedAsHost={earnedAsHost}
      isBalancePending={isBalancePending}
      name={name}
      optimisticBalance={optimisticBalance}
      paidAsRenter={paidAsRenter}
      sumIncome={sumIncome}
    />
    <HostReviewSection avgRating={avgRating} reviewCount={reviewCount} />
  </div>
);

export { HostSummaryBand };
