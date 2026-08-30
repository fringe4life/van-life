import { Badge } from "~/components/ui/badge";
import type { ReviewModel } from "~/db/client.server";
import { MAX_RATING } from "~/features/host/constants/constants";
import {
  normalizeReviewRating,
  reviewBadge,
  reviewMeta,
} from "./review-recipe";

type ReviewBadgeProps = Pick<ReviewModel, "rating">;

const ReviewBadge = ({ rating }: ReviewBadgeProps) => {
  const score = normalizeReviewRating(rating);
  const { label } = reviewMeta[score];

  return (
    <Badge
      aria-label={`${label}: ${score} out of ${MAX_RATING} stars`}
      className={reviewBadge({ rating: score })}
      size="small"
      title={`${label}: ${score} out of ${MAX_RATING} stars`}
      variant="outline"
    >
      {label}
    </Badge>
  );
};

export { ReviewBadge };
