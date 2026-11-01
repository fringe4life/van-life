import { StarIcon } from "lucide-react";
import type { ReactNode } from "react";
import { ViewTransition } from "react";
import { css, cx } from "styled-system/css";
import { cq, flex } from "styled-system/patterns";
import { chromeViewTransitionName } from "~/components/view-transition-names";
import { viewTransitionPage } from "~/components/view-transition-share";
import type {
  RatingBucket,
  RatingMixData,
} from "~/features/host/utils/rating-mix";

/**
 * Decorative glyph run. Cap so a busy host does not hydrate thousands of SVGs;
 * the numeric count column still shows the true total.
 */
const MAX_RATING_GLYPHS = 48;

const glyph = css({
  "@rating-mix/lg": { blockSize: "9px", inlineSize: "9px" },
  blockSize: "8px",
  fill: "rating",
  inlineSize: "8px",
  stroke: "none",
});

const glyphField = css({
  "@rating-mix/lg": {
    gap: "3px",
    gridTemplateColumns: "repeat(auto-fill, 9px)",
  },
  display: "grid",
  gap: "2px",
  gridTemplateColumns: "repeat(auto-fill, 8px)",
  justifyItems: "start",
});

const tallyRow = css({
  "@rating-mix/lg": {
    columnGap: "4",
    gridTemplateColumns: "4.5rem minmax(0, 1fr) 4rem 3.5rem",
  },
  alignItems: "center",
  columnGap: "2.5",
  display: "grid",
  gridTemplateColumns: "3.25rem minmax(0, 1fr) 3rem",
});

const tallyHeading = css({
  color: "muted.foreground",
  fontSize: "xs",
  fontWeight: "bold",
  letterSpacing: "widest",
  textTransform: "uppercase",
});

const numeric = css({
  fontVariantNumeric: "tabular-nums",
  textAlign: "end",
});

const shareColumn = css({
  display: { "@rating-mix/lg": "block", base: "none" },
});

const RatingRow = ({ bucket }: { bucket: RatingBucket }): ReactNode => (
  <li
    className={cx(
      tallyRow,
      css({
        _first: { borderBlockStart: "none" },
        "@rating-mix/lg": { paddingBlock: "2.5" },
        borderBlockStart: "1px solid",
        borderColor: "border.subtle",
        paddingBlock: "2",
      })
    )}
  >
    <span className={flex({ alignItems: "center", gap: "1.5" })}>
      <StarIcon
        aria-hidden="true"
        className={css({
          blockSize: "13px",
          fill: "rating",
          inlineSize: "13px",
          stroke: "none",
        })}
      />
      <span
        className={css({
          fontSize: "sm",
          fontVariantNumeric: "tabular-nums",
          fontWeight: "bold",
        })}
      >
        {bucket.rating}
      </span>
    </span>

    <span
      aria-hidden="true"
      className={glyphField}
      title={`${bucket.count} reviews`}
    >
      {Array.from(
        { length: Math.min(bucket.count, MAX_RATING_GLYPHS) },
        (_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: the run is a positional tally of identical glyphs, not a keyed list of records
          <StarIcon className={glyph} key={`${bucket.rating}-${index}`} />
        )
      )}
      {bucket.count > MAX_RATING_GLYPHS ? (
        <span
          className={css({
            color: "muted.foreground",
            fontSize: "xs",
            fontWeight: "bold",
            lineHeight: "1",
          })}
        >
          …
        </span>
      ) : null}
    </span>

    <span className={cx(numeric, css({ fontSize: "sm", fontWeight: "bold" }))}>
      {bucket.count}
    </span>

    <span
      className={cx(
        numeric,
        shareColumn,
        css({ color: "muted.foreground", fontSize: "sm" })
      )}
    >
      {bucket.percentage}%
    </span>
  </li>
);

/**
 * Rating breakdown for host reviews: one row per rating with a glyph per review.
 * The page average lives in the heading row, so this block only owns the detail.
 * Sizing follows the `rating-mix` container, not the viewport, so the host shell's
 * nav does not change the layout.
 */
const RatingMix = ({ buckets }: RatingMixData): ReactNode => (
  <ViewTransition
    {...viewTransitionPage}
    name={chromeViewTransitionName.hostChart}
  >
    <section
      aria-label="Rating breakdown"
      className={cx(
        cq({ name: "rating-mix" }),
        css({ marginBlockEnd: "8", marginBlockStart: "6" })
      )}
    >
      <div
        className={cx(
          tallyRow,
          css({
            borderBlockEnd: "1px solid",
            borderColor: "border.subtle",
            paddingBlockEnd: "2.5",
          })
        )}
      >
        <span className={tallyHeading}>Rating</span>
        <span aria-hidden="true" />
        <span className={cx(tallyHeading, numeric)}>Reviews</span>
        <span className={cx(tallyHeading, numeric, shareColumn)}>Share</span>
      </div>

      {/* Ruled ledger rows on the page surface: a breakdown is not a panel. */}
      <ul
        className={css({
          borderBlockEnd: "1px solid",
          borderColor: "border.subtle",
          listStyle: "none",
          margin: "0",
          padding: "0",
        })}
      >
        {buckets.map((bucket) => (
          <RatingRow bucket={bucket} key={bucket.rating} />
        ))}
      </ul>
    </section>
  </ViewTransition>
);

export { RatingMix };
