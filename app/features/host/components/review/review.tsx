import type { CSSProperties } from "react";
import { Card, CardContent } from "~/components/ui/card";
import type { ReviewModel, UserModel } from "~/db/client.server";
import { MAX_RATING } from "~/features/host/constants/constants";
import type { Maybe, Prettify } from "~/types";
import { RatingStars } from "./rating-stars";
import { ReviewBadge } from "./review-badge";
import { formatReviewRating, normalizeReviewRating } from "./review-recipe";

type ReviewProps = Prettify<
  Pick<UserModel, "name"> &
    Omit<
      ReviewModel,
      "user" | "rent" | "createdAt" | "updatedAt" | "rentId" | "userId"
    > & {
      timestamp: Maybe<string>;
    }
>;

type RatingRailStyle = CSSProperties & {
  "--rating": number;
};

const Review = ({ id, name, rating, text, timestamp }: ReviewProps) => {
  const headingId = `review-${id}-title`;
  const normalizedRating = normalizeReviewRating(rating);
  const railStyle: RatingRailStyle = { "--rating": normalizedRating };

  return (
    <div className="@container/review min-w-0 self-start">
      <Card
        aria-labelledby={headingId}
        className="relative grid min-w-0 @min-lg/review:grid-cols-[minmax(0,1fr)_minmax(12rem,auto)] grid-cols-1 items-start @min-lg/review:items-center @min-lg/review:gap-x-8 @min-lg/review:gap-y-0 gap-y-4 overflow-hidden border-border-subtle bg-card p-6 @min-lg/review:pl-10 pl-8 shadow-none"
        role="article"
      >
        <span
          aria-hidden="true"
          className="rating-rail pointer-events-none absolute inset-y-0 left-0 w-1.5 rounded-l-xl"
          data-rating={normalizedRating}
          style={railStyle}
        />
        <CardContent className="contents">
          <div className="min-w-0 @min-lg/review:self-center">
            <div className="mb-4 flex min-w-0 flex-wrap items-center gap-3">
              <span className="font-bold text-muted-foreground text-xs uppercase tracking-widest">
                Renter review
              </span>
              <ReviewBadge rating={normalizedRating} />
            </div>
            <h3 className="sr-only" id={headingId}>
              Review from {name}
            </h3>
            <blockquote className="max-w-160 font-medium text-foreground text-xl leading-7 tracking-tight">
              <span
                aria-hidden="true"
                className="mr-1 align-text-bottom font-extrabold text-4xl text-rating leading-none"
              >
                “
              </span>
              {text}
            </blockquote>
            <fieldset
              aria-label={`Rating: ${normalizedRating} out of ${MAX_RATING} stars`}
              className="mt-5 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2 border-0 p-0"
            >
              <RatingStars rating={normalizedRating} />
              <span className="font-bold text-foreground text-sm tabular-nums">
                {formatReviewRating(normalizedRating)} / {MAX_RATING}
              </span>
            </fieldset>
          </div>
          <dl className="@min-lg/review:col-start-2 @min-lg/review:row-start-1 flex @min-lg/review:grid min-w-0 flex-wrap items-center @min-lg/review:gap-4 gap-x-5 gap-y-2 @min-lg/review:self-center @min-lg/review:justify-self-end border-border-subtle border-t @min-lg/review:border-t-0 @min-lg/review:border-l @min-lg/review:pt-0 pt-4 @min-lg/review:pl-8">
            <div className="flex min-w-0 flex-row @min-lg/review:flex-col @min-lg/review:items-start items-baseline @min-lg/review:gap-0 gap-2">
              <dt className="sr-only @min-lg/review:not-sr-only mb-1 font-bold text-muted-foreground text-xs uppercase tracking-widest">
                Renter
              </dt>
              <dd className="wrap-break-words font-bold text-base tracking-tight">
                {name}
              </dd>
            </div>
            <div className="flex min-w-0 flex-row @min-lg/review:flex-col @min-lg/review:items-start items-baseline @min-lg/review:gap-0 gap-2">
              <dt className="sr-only @min-lg/review:not-sr-only mb-1 font-bold text-muted-foreground text-xs uppercase tracking-widest">
                Date
              </dt>
              <dd className="wrap-break-words text-muted-foreground text-sm tabular-nums">
                <time suppressHydrationWarning>
                  {timestamp ?? "Date unavailable"}
                </time>
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
};

export { Review };
