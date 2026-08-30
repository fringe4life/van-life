import { cva } from "cva";
import { MAX_RATING } from "~/features/host/constants/constants";

type ReviewScore = 1 | 2 | 3 | 4 | 5;

const reviewMeta = {
  1: { label: "Low rating" },
  2: { label: "Below average" },
  3: { label: "Average rating" },
  4: { label: "Good rating" },
  5: { label: "Excellent rating" },
} as const satisfies Record<ReviewScore, { label: string }>;

const reviewBadge = cva({
  base: "rounded-full border px-2.5 py-1 font-semibold text-xs",
  variants: {
    rating: {
      1: "border-border-accent bg-surface-accent text-foreground",
      2: "border-border-accent/70 bg-surface-muted text-foreground",
      3: "border-border-strong/50 bg-surface-muted text-foreground",
      4: "border-success/35 bg-success/10 text-success",
      5: "border-success/50 bg-success/10 text-success",
    } satisfies Record<ReviewScore, string>,
  },
});

const normalizeReviewRating = (rating: number): ReviewScore => {
  const normalizedRating = Math.min(
    MAX_RATING,
    Math.max(1, Math.round(rating))
  );

  return normalizedRating as ReviewScore;
};

const formatReviewRating = (rating: number) =>
  String(normalizeReviewRating(rating));

export type { ReviewScore };
export { formatReviewRating, normalizeReviewRating, reviewBadge, reviewMeta };
