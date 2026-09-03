import { StarIcon } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import type { ReviewModel } from "~/db/client.server";
import { MAX_RATING } from "~/features/host/constants/constants";
import type { Prettify } from "~/types";
import { css, cx } from "../../../../../styled-system/css";
import { flex, visuallyHidden } from "../../../../../styled-system/patterns";

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
    <div
      aria-hidden="true"
      className={css({
        blockSize: "var(--star-size)",
        inlineSize: "var(--star-size)",
        position: "relative",
      })}
    >
      <StarIcon
        className={css({
          blockSize: "var(--star-size)",
          inlineSize: "var(--star-size)",
          stroke: "rating",
        })}
      />

      <div
        className={cx("rating-star-fill", css({ color: "rating" }))}
        style={starStyle}
      >
        <StarIcon
          className={css({
            blockSize: "var(--star-size)",
            fill: "currentColor",
            inlineSize: "var(--star-size)",
            stroke: "currentColor",
          })}
        />
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
    <span
      className={css({
        blockSize: "var(--star-size)",
        contain: "strict",
        display: "inline-flex",
        inlineSize: "var(--rating-stars-width)",
        position: "relative",
      })}
    >
      <img
        alt={`Rating: ${rating} out of ${MAX_RATING} stars`}
        className={visuallyHidden()}
        height={1}
        src={TRANSPARENT_PIXEL}
        width={1}
      />
      <span
        aria-hidden="true"
        className={cx(
          flex({ gap: "var(--star-gap)" }),
          css({
            inset: "0",
            position: "absolute",
          })
        )}
      >
        {stars}
      </span>
    </span>
  );
};

export { RatingStars };
