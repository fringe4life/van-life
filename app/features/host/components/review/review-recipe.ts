import { css, cx } from "styled-system/css";
import { MAX_RATING } from "~/features/host/constants/constants";

type ReviewScore = 1 | 2 | 3 | 4 | 5;

const reviewMeta = {
  1: { label: "Low rating" },
  2: { label: "Below average" },
  3: { label: "Average rating" },
  4: { label: "Good rating" },
  5: { label: "Excellent rating" },
} as const satisfies Record<ReviewScore, { label: string }>;

const reviewBadgeBase = css({
  borderRadius: "full",
  borderStyle: "solid",
  borderWidth: "1",
  fontSize: "xs",
  fontWeight: "medium",
  paddingBlock: "1",
  paddingInline: "2.5",
});

/**
 * Workaround: top-level `css()` maps instead of `cva` so open
 * `reviewBadge({ rating })` does not pull the full recipe runtime into the
 * client bundle (#471 / #269).
 *
 * @remarks
 * Still required on `@pandacss/vite@2.4.0` / `@pandacss/dev@2.4.0`.
 * Drop when Panda emits string-only residual recipes; re-verify no `cva-*.js`
 * after clean `styled-system` + `build`.
 *
 * @see https://github.com/fringe4life/van-life/issues/471 — tracking
 */
const reviewBadgeByRating = {
  1: css({
    backgroundColor: "surface.accent",
    borderColor: "border.accent",
    color: "foreground",
  }),
  2: css({
    backgroundColor: "surface.muted",
    borderColor: "border.accent/70",
    color: "foreground",
  }),
  3: css({
    backgroundColor: "surface.muted",
    borderColor: "border.strong/50",
    color: "foreground",
  }),
  4: css({
    backgroundColor: "success/10",
    borderColor: "success/35",
    color: "success",
  }),
  5: css({
    backgroundColor: "success/10",
    borderColor: "success/50",
    color: "success",
  }),
} as const satisfies Record<ReviewScore, string>;

function reviewBadge({ rating }: { rating: ReviewScore }) {
  return cx(reviewBadgeBase, reviewBadgeByRating[rating]);
}

const normalizeReviewRating = (rating: number): ReviewScore => {
  const normalizedRating = Math.min(
    MAX_RATING,
    Math.max(1, Math.round(rating))
  );

  return normalizedRating as ReviewScore;
};

const formatReviewRating = (rating: number) =>
  String(normalizeReviewRating(rating));

export { formatReviewRating, normalizeReviewRating, reviewBadge, reviewMeta };
