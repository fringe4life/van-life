import type { ReactNode } from "react";
import { ViewTransition } from "react";
import { href } from "react-router";
import { css, cx } from "styled-system/css";
import { flex } from "styled-system/patterns";
import { ArrowRightIcon } from "~/components/icons/arrow-right-icon";
import { CustomLink } from "~/components/links/custom-link";
import { tabularNums } from "~/components/ui/figures";
import { chromeViewTransitionName } from "~/components/view-transition-names";
import { viewTransitionShare } from "~/components/view-transition-share";
import { RatingStars } from "~/features/host/components/review/rating-stars";

interface HostReviewSectionProps {
  avgRating: number;
  reviewCount: number;
}

const tier = cx(
  flex({
    alignItems: "center",
    columnGap: "5",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: "2",
  }),
  css({
    backgroundColor: "surface.accent",
    borderBlockStart: "1px solid",
    borderColor: "border",
    paddingBlock: "5",
    paddingInline: { "@summary/4xl": "12", base: "6" },
  })
);

const reviewLink = css({
  alignItems: "center",
  color: "foreground",
  display: "inline-flex",
  fontSize: "sm",
  fontWeight: "medium",
  gap: "1.5",
  lineHeight: "6",
});

/**
 * Same split as the ledger link: motion in the glyph, colour here. On the accent
 * surface the arrow starts muted and takes `primary` only while the link is
 * hovered or focused, which is the moment it is pointing at something.
 */
const reviewIcon = css({
  _groupFocusVisible: { color: "primary" },
  _groupHover: { color: "primary" },
  blockSize: "3.5",
  color: "muted.foreground",
  flexShrink: "0",
  inlineSize: "3.5",
  transitionDuration: "200ms",
  transitionProperty: "color",
  transitionTimingFunction: "air",
});

/** The glyph's hover selectors read `.group`, so the anchor carries the marker. */
const GROUP_MARKER = "group";

/**
 * Narrow bands put the rating on its own row under the label and spread it
 * across that row; from 36rem it sits at the end of the label's row again. Both
 * rows centre their content vertically, so the taller stars never lift the
 * label off its baseline.
 */
const rating = flex({
  alignItems: "center",
  gap: "2.5",
  inlineSize: { "@summary/lg": "auto", base: "100%" },
  justifyContent: { "@summary/lg": "flex-start", base: "space-between" },
});

/**
 * Star sizing for this tier. `--rating-stars-width` is a :root computation, so
 * it is re-derived here — an inherited value would still be sized for the
 * global 1.25rem stars. n·size + (n − 1)·gap folded to n·(size + gap) − gap:
 * 1.125rem is the star, 0.375rem the gap, so this stays in step with both.
 */
const stars = css({
  "--rating-stars-width": "calc(var(--star-count) * 1.5rem - 0.375rem)",
  "--star-gap": "0.375rem",
  "--star-size": "1.125rem",
});

const average = cx(
  tabularNums,
  css({
    fontSize: { "@summary/4xl": "3xl", base: "2xl" },
    fontWeight: "bold",
    lineHeight: "1.1",
  })
);

const count = css({
  color: "muted.foreground",
  fontSize: "xs",
  lineHeight: "4",
});

const toCountLabel = (reviewCount: number): string => {
  if (reviewCount === 0) {
    return "No reviews yet";
  }

  return `${reviewCount} ${reviewCount === 1 ? "review" : "reviews"}`;
};

/**
 * Lower tier of the dashboard summary band. The average is stated numerically
 * and the count qualifies it: a star run alone hides the one value the band can
 * state precisely (#453).
 */
const HostReviewSection = ({
  avgRating,
  reviewCount,
}: HostReviewSectionProps): ReactNode => (
  <div className={tier}>
    <CustomLink
      className={cx(reviewLink, GROUP_MARKER)}
      to={href("/host/review")}
    >
      Reviews
      <ArrowRightIcon className={reviewIcon} />
    </CustomLink>

    <div className={rating}>
      {reviewCount > 0 ? (
        <>
          <span className={stars}>
            <ViewTransition
              {...viewTransitionShare}
              name={chromeViewTransitionName.hostRating}
            >
              <RatingStars rating={avgRating} />
            </ViewTransition>
          </span>
          <span className={average}>{avgRating.toFixed(1)}</span>
        </>
      ) : null}
      <span className={count}>{toCountLabel(reviewCount)}</span>
    </div>
  </div>
);

export { HostReviewSection };
