import { MAX_RATING } from "~/features/host/constants/constants";
import { cva } from "../../../../../styled-system/css";

type ReviewScore = 1 | 2 | 3 | 4 | 5;

const reviewMeta = {
  1: { label: "Low rating" },
  2: { label: "Below average" },
  3: { label: "Average rating" },
  4: { label: "Good rating" },
  5: { label: "Excellent rating" },
} as const satisfies Record<ReviewScore, { label: string }>;

const reviewBadge = cva({
  base: {
    borderRadius: "full",
    borderStyle: "solid",
    borderWidth: "1",
    fontSize: "xs",
    fontWeight: "semibold",
    paddingBlock: "1",
    paddingInline: "2.5",
  },
  variants: {
    rating: {
      1: {
        backgroundColor: "surface.accent",
        borderColor: "border.accent",
        color: "foreground",
      },
      2: {
        backgroundColor: "surface.muted",
        borderColor: "border.accent/70",
        color: "foreground",
      },
      3: {
        backgroundColor: "surface.muted",
        borderColor: "border.strong/50",
        color: "foreground",
      },
      4: {
        backgroundColor: "success/10",
        borderColor: "success/35",
        color: "success",
      },
      5: {
        backgroundColor: "success/10",
        borderColor: "success/50",
        color: "success",
      },
    },
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

export { formatReviewRating, normalizeReviewRating, reviewBadge, reviewMeta };
