import type { CSSProperties } from "react";
import { css, cx } from "styled-system/css";
import { cq, flex, grid, visuallyHidden, wrap } from "styled-system/patterns";
import { LocalTime } from "~/components/local-time";
import { scrollReveal } from "~/components/scroll-reveal-recipe";
import { Card, CardContent } from "~/components/ui/card";
import type { ReviewModel, UserModel } from "~/db/client.server";
import { MAX_RATING } from "~/features/host/constants/constants";
import {
  CHART_HEIGHT_BAND_COLOR_BY_VARIANT,
  type ChartHeightBandVariant,
} from "~/features/host/utils/chart-height-bands";
import type { Prettify } from "~/types";
import { RatingStars } from "./rating-stars";
import { ReviewBadge } from "./review-badge";
import { formatReviewRating, normalizeReviewRating } from "./review-recipe";

type ReviewProps = Prettify<
  Pick<UserModel, "name"> &
    Omit<
      ReviewModel,
      "user" | "rent" | "createdAt" | "updatedAt" | "rentId" | "userId"
    > & {
      date: Date;
      heightBand: ChartHeightBandVariant;
    }
>;

type RatingRailStyle = CSSProperties & {
  "--rating": number;
  "--rating-band-color": string;
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

const Review = ({ date, heightBand, id, name, rating, text }: ReviewProps) => {
  const headingId = `review-${id}-title`;
  const normalizedRating = normalizeReviewRating(rating);
  const railStyle: RatingRailStyle = {
    "--rating": normalizedRating,
    "--rating-band-color": CHART_HEIGHT_BAND_COLOR_BY_VARIANT[heightBand],
  };

  return (
    <div
      className={cx(
        cq({ name: "review" }),
        scrollReveal({ variant: "tilt" }),
        css({ alignSelf: "start", minInlineSize: "0" })
      )}
      style={railStyle}
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
          data-height-band={heightBand}
          data-rating={normalizedRating}
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
                  color: "var(--rating-band-color, {colors.rating})",
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
                <LocalTime date={date} />
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
};

export { Review };
