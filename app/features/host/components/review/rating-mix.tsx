import type { ReactNode } from "react";
import { ViewTransition } from "react";
import { css } from "styled-system/css/css";
import { cx } from "styled-system/css/cx";
import { cq, flex } from "styled-system/patterns";
import { StarGlyph } from "~/components/icons/star-icon";
import { tabularNums } from "~/components/ui/figures";
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

/**
 * At 8–9px a filled star's arms thin out into an asterisk, so the silhouette is
 * stroked in its own fill colour: the path is unchanged, the mark just gets
 * heavier where it would otherwise disappear. A size-specific class rather than
 * a second drawing (#423).
 */
const glyph = css({
  "@rating-mix/lg": { blockSize: "9px", inlineSize: "9px" },
  blockSize: "8px",
  fill: "rating",
  inlineSize: "8px",
  stroke: "rating",
  strokeWidth: 1.2,
});

const glyphField = css({
  "@rating-mix/lg": {
    gap: "3px",
  },
  display: "flex",
  flexWrap: "wrap",
  gap: "2px",
  minInlineSize: "0",
});

/**
 * One set of tracks for the heading and every tally row (#480). `ul` is
 * `display: contents` so each `li` is a subgrid of this parent, not its own
 * four-column grid whose Share column could shrink past the heading.
 */
const tally = css({
  // Gap lives on this inner grid, not the named container: `@rating-mix/lg`
  // only matches descendants (#480 / Qodo).
  "@rating-mix/lg": { columnGap: "4" },
  columnGap: "2.5",
  display: "grid",
  gridTemplateColumns: "max-content minmax(0, 1fr) max-content max-content",
  marginBlockEnd: "8",
  marginBlockStart: "6",
});

const tallyRow = css({
  alignItems: "center",
  display: "grid",
  gridColumn: "1 / -1",
  gridTemplateColumns: "subgrid",
});

const tallyHeading = css({
  color: "muted.foreground",
  fontSize: "xs",
  fontWeight: "bold",
  letterSpacing: "widest",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
});

const numeric = cx(
  tabularNums,
  css({
    textAlign: "end",
    whiteSpace: "nowrap",
  })
);

const RatingRow = ({ bucket }: { bucket: RatingBucket }): ReactNode => (
  <li
    className={cx(
      tallyRow,
      css({
        _first: { borderBlockStart: "none" },
        _last: { borderBlockEnd: "1px solid" },
        "@rating-mix/lg": { paddingBlock: "2.5" },
        borderBlockStart: "1px solid",
        borderColor: "border.subtle",
        paddingBlock: "2",
      })
    )}
  >
    <span className={flex({ alignItems: "center", gap: "1.5" })}>
      <StarGlyph
        aria-hidden="true"
        className={css({
          blockSize: "13px",
          fill: "rating",
          inlineSize: "13px",
          stroke: "none",
        })}
      />
      <span
        className={cx(
          tabularNums,
          css({
            fontSize: "sm",
            fontWeight: "bold",
          })
        )}
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
          <StarGlyph className={glyph} key={`${bucket.rating}-${index}`} />
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
      className={cq({ name: "rating-mix" })}
    >
      <div className={tally}>
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
          <span className={cx(tallyHeading, numeric)}>Share</span>
        </div>

        {/* Ruled ledger rows on the page surface: a breakdown is not a panel. */}
        <ul
          className={css({
            display: "contents",
            listStyle: "none",
            margin: "0",
            padding: "0",
          })}
        >
          {buckets.map((bucket) => (
            <RatingRow bucket={bucket} key={bucket.rating} />
          ))}
        </ul>
      </div>
    </section>
  </ViewTransition>
);

export { RatingMix };
