import { useCallback } from "react";
import { css } from "styled-system/css/css";
import { cx } from "styled-system/css/cx";
import { grid } from "styled-system/patterns";
import type { Prettify } from "~/types";
import { FilterOption, type FilterTone } from "./filter-option";
import type { VanStateFilterChange, VanStateFilterFacet } from "./types";
import type { VanStateFilterKey } from "./van-state-filter-config";

type VanStateFilterSectionProps = Prettify<
  VanStateFilterChange & {
    facets: readonly VanStateFilterFacet[];
  }
>;

type VanStateFilterRowProps = Prettify<
  VanStateFilterChange & {
    facet: VanStateFilterFacet;
  }
>;

/*
 * Each facet filters a van state, so its key fills with that state's own colour
 * — the amber a van in repair wears, the green of a sale. The label carries the
 * meaning as well; the fill is a confirmation, never the only signal.
 */
const toneByKey = {
  excludeInRepair: "repair",
  onlyOnSale: "sale",
} as const satisfies Record<VanStateFilterKey, FilterTone>;

const pendingClassName = css({
  opacity: 0.75,
});

const sectionClassName = css({
  borderWidth: "0",
  margin: "0",
  minInlineSize: "0",
  padding: "0",
});

const legendClassName = css({
  color: "muted.foreground",
  fontSize: "xs",
  fontWeight: "medium",
  letterSpacing: "0.08em",
  lg: {
    color: "foreground",
    fontSize: "sm",
    letterSpacing: "normal",
    paddingBlock: "1.5",
    textTransform: "none",
  },
  paddingBlock: "0",
  paddingInlineEnd: "0",
  /* Matches the row's inset so the caption sits over the keys, not the tint. */
  paddingInlineStart: "2",
  textTransform: "uppercase",
});

const VanStateFilterRow = ({
  facet,
  onCheckedChange,
}: VanStateFilterRowProps) => {
  const handleChange = useCallback(
    (checked: boolean) => {
      onCheckedChange(facet.key, checked);
    },
    [facet.key, onCheckedChange]
  );

  return (
    <FilterOption
      checked={facet.checked}
      className={cx(facet.isPending && pendingClassName)}
      label={facet.label}
      onChange={handleChange}
      tone={toneByKey[facet.key]}
    />
  );
};

const VanStateFilterSection = ({
  facets,
  onCheckedChange,
}: VanStateFilterSectionProps) => (
  <fieldset
    className={cx(
      sectionClassName,
      grid({
        /*
         * One column in the compact half-panel and in the rail. Two columns at
         * `md` assumed the 3rem gutter had created room (#495).
         */
        columns: 1,
        gap: "0.5",
      })
    )}
  >
    <legend className={legendClassName}>State Filters</legend>
    {facets.map((facet) => (
      <VanStateFilterRow
        facet={facet}
        key={facet.key}
        onCheckedChange={onCheckedChange}
      />
    ))}
  </fieldset>
);

export { VanStateFilterSection };
