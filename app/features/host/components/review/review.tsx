import type { CSSProperties } from "react";
import { Card, CardContent } from "~/components/ui/card";
import type { ReviewModel, UserModel } from "~/db/client.server";
import { MAX_RATING } from "~/features/host/constants/constants";
import type { Maybe, Prettify } from "~/types";
import { css, cx } from "../../../../../styled-system/css";
import {
  cq,
  flex,
  grid,
  visuallyHidden,
  wrap,
} from "../../../../../styled-system/patterns";
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

const reviewMetadataLabel = css({
  "@review/lg": {
    clip: "auto",
    height: "auto",
    margin: "0",
    overflow: "visible",
    position: "static",
    whiteSpace: "normal",
    width: "auto",
  },
  color: "muted.foreground",
  fontSize: "xs",
  fontWeight: "bold",
  letterSpacing: "widest",
  lineHeight: "4",
  marginBlockEnd: "1",
  srOnly: true,
  textTransform: "uppercase",
});

const Review = ({ id, name, rating, text, timestamp }: ReviewProps) => {
  const headingId = `review-${id}-title`;
  const normalizedRating = normalizeReviewRating(rating);
  const railStyle: RatingRailStyle = { "--rating": normalizedRating };

  return (
    <div
      className={cx(
        cq({ name: "review" }),
        css({ alignSelf: "start", minInlineSize: "0" })
      )}
    >
      <Card
        aria-labelledby={headingId}
        className={cx(
          grid({
            "@review/lg": {
              alignItems: "center",
              columnGap: "8",
              gridTemplateAreas: '"content metadata"',
              gridTemplateColumns: "minmax(0,1fr) minmax(12rem,auto)",
              rowGap: "0",
            },
            alignItems: "start",
            columns: 1,
            gridTemplateAreas: '"content" "metadata"',
            rowGap: "4",
          }),
          css({
            backgroundColor: "card",
            borderColor: "border.subtle",
            minInlineSize: "0",
            overflow: "hidden",
            padding: "6",
            paddingInlineStart: { "@review/lg": "10", base: "8" },
            position: "relative",
            shadow: "none",
          })
        )}
        role="article"
      >
        <span
          aria-hidden="true"
          className={cx(
            "rating-rail",
            css({
              borderLeftRadius: "xl",
              inlineSize: "1.5",
              insetBlock: "0",
              insetInlineStart: "0",
              pointerEvents: "none",
              position: "absolute",
            })
          )}
          data-rating={normalizedRating}
          style={railStyle}
        />

        <CardContent className={css({ display: "contents" })}>
          <div
            className={css({
              "@review/lg": { alignSelf: "center" },
              gridArea: "content",
              minInlineSize: "0",
            })}
          >
            <div
              className={wrap({
                alignItems: "center",
                gap: "3",
                marginBlockEnd: "4",
                minInlineSize: "0",
              })}
            >
              <span
                className={css({
                  color: "muted.foreground",
                  fontSize: "xs",
                  fontWeight: "bold",
                  letterSpacing: "widest",
                  textTransform: "uppercase",
                })}
              >
                Renter review
              </span>
              <ReviewBadge rating={normalizedRating} />
            </div>
            <h3 className={visuallyHidden()} id={headingId}>
              Review from {name}
            </h3>

            <blockquote
              className={css({
                color: "foreground",
                fontSize: "xl",
                fontWeight: "medium",
                letterSpacing: "tight",
                lineHeight: "7",
                maxInlineSize: "40rem",
              })}
            >
              <span
                aria-hidden="true"
                className={css({
                  color: "rating",
                  fontSize: "4xl",
                  fontWeight: "extrabold",
                  lineHeight: "none",
                  marginInlineEnd: "1",
                  textAlign: "end",
                })}
              >
                “
              </span>
              {text}
            </blockquote>
            <fieldset
              aria-label={`Rating: ${normalizedRating} out of ${MAX_RATING} stars`}
              className={wrap({
                alignItems: "center",
                border: "none",
                columnGap: "3",
                marginBlockStart: "5",
                minInlineSize: "0",
                padding: "0",
                rowGap: "2",
              })}
            >
              <RatingStars rating={normalizedRating} />

              <span
                className={css({
                  color: "foreground",
                  fontSize: "sm",
                  fontVariantNumeric: "tabular-nums",
                  fontWeight: "bold",
                })}
              >
                {formatReviewRating(normalizedRating)} / {MAX_RATING}
              </span>
            </fieldset>
          </div>

          <dl
            className={cx(
              css({
                "@review/lg": {
                  alignSelf: "center",
                  display: "grid",
                  gridArea: "metadata",
                  justifySelf: "end",
                },
                gridArea: "metadata",
              }),
              wrap({
                alignItems: "center",
                columnGap: "5",
                rowGap: "2",
              }),
              css({
                "@review/lg": {
                  borderLeftWidth: "thin",
                  borderTopWidth: "0",
                  paddingBlockStart: "0",
                  paddingInlineStart: "8",
                },
                borderColor: "border.subtle",
                borderTopWidth: "thin",
                marginBlockStart: "0",
                marginInlineStart: "0",
                paddingBlockStart: { "@review/lg": "0", base: "4" },
              })
            )}
          >
            <div
              className={flex({
                alignItems: { "@review/lg": "start", base: "baseline" },
                flexDirection: { "@review/lg": "column", base: "row" },
                gap: { "@review/lg": "0", base: "2" },
              })}
            >
              <dt className={reviewMetadataLabel}>Renter</dt>

              <dd
                className={css({
                  fontSize: "base",
                  fontWeight: "bold",
                  letterSpacing: "tight",
                  wordBreak: "break-word",
                })}
              >
                {name}
              </dd>
            </div>

            <div
              className={flex({
                alignItems: { "@review/lg": "start", base: "baseline" },
                flexDirection: { "@review/lg": "column", base: "row" },
                gap: { "@review/lg": "0", base: "2" },
              })}
            >
              <dt className={reviewMetadataLabel}>Date</dt>

              <dd
                className={css({
                  color: "muted.foreground",
                  fontSize: "sm",
                  fontVariantNumeric: "tabular-nums",
                  wordBreak: "break-word",
                })}
              >
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
