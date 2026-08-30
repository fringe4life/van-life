import { StarIcon } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import type { ReviewModel } from "~/db/client.server";
import { MAX_RATING } from "~/features/host/constants/constants";
import type { Prettify } from "~/types";

type RatingStyles = CSSProperties & {
  "--rating": number;
  "--star-index"?: number;
};

type RatingStarsProps = Prettify<Pick<ReviewModel, "rating">>;

const TRANSPARENT_PIXEL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E";

interface StarProps {
  rating: number;
  starIndex: number;
}

const Star = ({ rating, starIndex }: StarProps): ReactNode => {
  const starStyle: RatingStyles = {
    "--rating": rating,
    "--star-index": starIndex,
  };

  return (
    <div aria-hidden="true" className="relative size-(--star-size)">
      <StarIcon className="size-(--star-size) stroke-rating" />
      <div className="rating-star-fill text-rating" style={starStyle}>
        <StarIcon className="size-(--star-size) fill-current stroke-current" />
      </div>
    </div>
  );
};

const RatingStars = ({ rating }: RatingStarsProps): ReactNode => {
  const stars = Array.from({ length: MAX_RATING }, (_, index) => {
    const starIndex = index + 1;

    return (
      <Star key={`star-${starIndex}`} rating={rating} starIndex={starIndex} />
    );
  });

  return (
    <span className="relative inline-flex h-(--star-size) w-(--rating-stars-width) contain-strict">
      <img
        alt={`Rating: ${rating} out of ${MAX_RATING} stars`}
        className="sr-only"
        height={1}
        src={TRANSPARENT_PIXEL}
        width={1}
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 flex gap-(--star-gap)"
      >
        {stars}
      </span>
    </span>
  );
};

export { RatingStars };
