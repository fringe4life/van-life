import type { TransitionStartFunction } from "react";
import { css, cx } from "styled-system/css";
import { flex, grid, hstack } from "styled-system/patterns";
import { ChevronIcon } from "~/components/icons/chevron-icon";
import { FilterIcon } from "~/components/icons/filter-icon";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { useVanFilters } from "~/features/vans/hooks/use-van-filters";
import { VanStateFilterSection } from "./van-state-filter-section";
import { VanTypeFilterSection } from "./van-type-filter-section";

/*
 * The rail: a structural column beside the catalog from `lg`. Everything that
 * used to make it a card on compact — the translucent fill, the border ring, the
 * radius, the shadow — is gone. A column does not need a box around it.
 */
const railClassName = css({
  lg: {
    /*
     * `start` keeps the rail at its content height. The grid area stretches to
     * the catalog's height and `maxBlockSize` caps the box at the viewport, so
     * without this the `borderInlineStart` rule ran the full column — a page
     * divider next to a six-row list. The rail still sticks: its containing
     * block is the stretched grid area, not its own height.
     */
    alignSelf: "start",
    borderColor: "border.accent",
    borderInlineStartWidth: "2",
    insetBlockStart: "var(--header-height)",
    maxBlockSize: "calc(100dvh - var(--header-height))",
    overflowY: "auto",
    paddingInlineStart: "5",
    position: "sticky",
  },
  minInlineSize: "0",
});

/*
 * Compact: a native disclosure. Same DOM at every width; `display` is the only
 * thing that changes, so no control is duplicated and nothing in the shadow of
 * a hidden branch can take focus.
 *
 * `::details-content` (Baseline 2025) is what animates open/close. Unsupported
 * engines ignore the pseudo — the panel still toggles, just without the motion.
 * `interpolate-size` is Chromium-only today; inert elsewhere, so the panel snaps.
 * `content-visibility` needs `allow-discrete` so the panel stays rendered for
 * the length of the transition instead of blinking out on the first frame.
 */
const disclosureClassName = cx(
  "group/filter-disclosure",
  css({
    "&::details-content": {
      _red: { transition: "none" },
      blockSize: "0",
      contentVisibility: "hidden",
      overflow: "clip",
      transition:
        "block-size 320ms {easings.glide}, content-visibility 320ms allow-discrete",
    },
    "&[open]::details-content": {
      blockSize: "auto",
      contentVisibility: "visible",
    },
    display: { base: "block", lg: "none" },
    interpolateSize: "allow-keywords",
  })
);

/*
 * The summary is the only elevated surface in the block: it is the thing you can
 * press. `display: flex` is what removes the UA triangle — a flex-item summary
 * has no ::marker to draw.
 */
const summaryClassName = css({
  alignItems: "center",
  backgroundColor: "surface.muted",
  blockSize: "12",
  borderBlockEndColor: "border.subtle",
  borderBlockEndWidth: "thin",
  /*
   * The UA already paints a summary as a pointer; it is kept explicit because
   * the rest of the block now signals too — an option row sets a pointer
   * because its `<input>` is visually hidden, and a disclosure that stayed
   * `default` would be the one press target that did not.
   */
  cursor: "pointer",
  display: "flex",
  gap: "3",
  justifyContent: "space-between",
  listStyle: "none",
  paddingInline: "4",
});

const summaryLabelClassName = css({
  fontSize: "sm",
  fontWeight: "medium",
  letterSpacing: "title",
});

const summaryTrailClassName = flex({
  alignItems: "center",
  gap: "3",
  justifyContent: "flex-end",
});

const summaryCountClassName = css({
  color: "muted.foreground",
  fontSize: "xs",
  fontVariantNumeric: "tabular-nums",
});

const summaryChevronClassName = css({
  _dis: {
    rotate: "180deg",
  },
  _red: {
    transitionDuration: "0s",
  },
  color: "muted.foreground",
  transitionDuration: "fast",
  transitionProperty: "rotate",
  transitionTimingFunction: "glide",
});

/*
 * Two captions side by side. Each group keeps one column of options until the
 * page gutter takes its 3rem at `md`, where the extra width becomes columns
 * inside the group instead of empty space at the end of a row.
 */
const compactPanelClassName = cx(
  grid({ columns: 2, gap: "4" }),
  css({
    paddingBlockEnd: "4",
    paddingBlockStart: "4",
  })
);

const compactFooterClassName = css({
  alignItems: "center",
  borderBlockStartColor: "border.subtle",
  borderBlockStartWidth: "thin",
  display: "flex",
  gridColumn: "1 / -1",
  justifyContent: "flex-end",
  paddingBlockStart: "3",
});

/*
 * `display` is declared here rather than alongside the `grid()` pattern: two
 * atomic display classes from different sources would be resolved by stylesheet
 * order, not by the order they are passed to `cx`.
 */
const railBodyClassName = css({
  display: { base: "none", lg: "grid" },
  gap: "4",
});

const clearAllClassName = css({
  blockSize: "auto",
  color: { _hover: "foreground", base: "muted.foreground" },
  /*
   * The option rows set a pointer because their `<input>` is hidden; the one
   * button in the same block has to match, or the row above it becomes the only
   * thing that looks pressable.
   */
  cursor: "pointer",
  fontSize: "sm",
  padding: "0",
  textDecoration: "underline",
  textDecorationColor: "border.strong",
  textUnderlineOffset: "4",
});

const clearRowClassName = cx(
  flex({
    alignItems: "center",
    gap: "3",
    justifyContent: "space-between",
  }),
  css({
    borderBlockEndColor: "border.subtle",
    borderBlockEndWidth: "thin",
    paddingBlockEnd: "3",
  })
);

const ClearAllButton = ({
  hasFilters,
  onClear,
}: {
  hasFilters: boolean;
  onClear: () => void;
}) => (
  <Button
    className={clearAllClassName}
    disabled={!hasFilters}
    onClick={onClear}
    size="sm"
    variant="link"
  >
    Clear all
  </Button>
);

const VanFilters = ({
  startTransition,
}: {
  startTransition?: TransitionStartFunction;
}) => {
  const {
    badgeCount,
    clearFilters,
    optimisticTypes,
    stateFacets,
    toggleType,
    setStateFilter,
  } = useVanFilters(startTransition);
  const hasFilters = badgeCount > 0;

  return (
    <aside aria-label="Van filters" className={railClassName}>
      <details className={disclosureClassName}>
        <summary className={summaryClassName}>
          <span className={summaryLabelClassName}>Filters</span>
          {/* The rail's badge announces through `aria-live`; the compact summary has
              to say it itself, because the badge is `display: none` down here. */}
          <span aria-live="polite" className={summaryTrailClassName}>
            {hasFilters ? (
              <span className={summaryCountClassName}>{badgeCount} active</span>
            ) : null}
            <ChevronIcon className={summaryChevronClassName} size={16} />
          </span>
        </summary>

        <div className={compactPanelClassName}>
          <VanTypeFilterSection onToggle={toggleType} types={optimisticTypes} />
          <VanStateFilterSection
            facets={stateFacets}
            onCheckedChange={setStateFilter}
          />
          <div className={compactFooterClassName}>
            <ClearAllButton hasFilters={hasFilters} onClear={clearFilters} />
          </div>
        </div>
      </details>

      <div className={railBodyClassName}>
        <header className={grid({ gap: "1" })}>
          <div
            className={cx(
              flex({
                alignItems: "center",
                gap: "3",
                justifyContent: "space-between",
              }),
              css({ minInlineSize: "0" })
            )}
          >
            <p
              className={cx(
                hstack({ gap: "2" }),
                css({
                  color: "muted.foreground",
                  fontSize: "xs",
                  fontWeight: "medium",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                })
              )}
            >
              <FilterIcon
                active={hasFilters}
                aria-hidden
                className={css({
                  blockSize: "4",
                  color: "primary",
                  inlineSize: "4",
                })}
              />
              Roadbook
            </p>
            <Badge
              aria-live="polite"
              className={css({
                flexShrink: "0",
                whiteSpace: "nowrap",
              })}
              size="small"
              variant={hasFilters ? "LUXURY" : "outline"}
            >
              {hasFilters ? `${badgeCount} active` : "All vans"}
            </Badge>
          </div>

          <h3
            className={css({
              fontSize: "xl",
              fontWeight: "bold",
              letterSpacing: "tight",
            })}
          >
            Narrow the route
          </h3>

          <p
            className={css({
              color: "muted.foreground",
              fontSize: "xs",
              lineHeight: "5",
            })}
          >
            Pick a van character, then keep the road open.
          </p>
        </header>

        <div className={clearRowClassName}>
          <span
            className={css({
              color: "muted.foreground",
              fontSize: "xs",
            })}
          >
            All available paths
          </span>
          <ClearAllButton hasFilters={hasFilters} onClear={clearFilters} />
        </div>

        <VanTypeFilterSection onToggle={toggleType} types={optimisticTypes} />
        <VanStateFilterSection
          facets={stateFacets}
          onCheckedChange={setStateFilter}
        />

        <p
          className={css({
            borderBlockStartColor: "border.subtle",
            borderBlockStartWidth: "thin",
            color: "muted.foreground",
            fontSize: "xs",
            lineHeight: "5",
            paddingBlockStart: "4",
          })}
        >
          Your selected route stays in the URL while the catalog updates.
        </p>
      </div>
    </aside>
  );
};

export { VanFilters };
