import { href } from "react-router";
import { css, cx } from "styled-system/css";
import { hstack } from "styled-system/patterns";
import { CustomLink } from "~/components/links/custom-link";
import { RatingStars } from "~/features/host/components/review/rating-stars";

interface HostReviewSectionProps {
  avgRating: number;
}

const HostReviewSection = ({ avgRating }: HostReviewSectionProps) => (
  <div
    className={cx(
      hstack({
        gap: "0",
        justifyContent: "space-between",
      }),
      css({
        backgroundColor: "surface.accent",
        inlineSize: "full",
        paddingBlock: { base: "6", sm: "9" },
        paddingInline: "padding-inline",
      })
    )}
  >
    <div
      className={css({
        fontSize: { base: "lg", sm: "2xl" },
        fontWeight: "bold",
        textShadow: "sm",
      })}
    >
      Your Avg Review <RatingStars rating={avgRating} />
    </div>
    <CustomLink
      className={css({
        fontSize: "md",
        fontWeight: "medium",
        textShadow: "sm",
      })}
      to={href("/host/review")}
    >
      Details
    </CustomLink>
  </div>
);

export { HostReviewSection };
