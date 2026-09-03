import { css, cx } from "styled-system/css";
import { grid } from "styled-system/patterns";
import type { Prettify } from "~/types";

import { FilterCheckboxRow } from "./filter-checkbox-row";
import type {
  FilterBaseId,
  VanStateFilterChange,
  VanStateFilterFacet,
} from "./types";

type VanStateFilterRowProps = Prettify<
  FilterBaseId &
    VanStateFilterChange & {
      facet: VanStateFilterFacet;
    }
>;

const VanStateFilterRow = ({
  baseId,
  facet,
  onCheckedChange,
}: VanStateFilterRowProps) => {
  const handleCheckedChange = (checked: boolean) => {
    onCheckedChange(facet.key, checked);
  };

  return (
    <FilterCheckboxRow
      checked={facet.checked}
      className={cx(facet.isPending && css({ opacity: 0.75 }))}
      id={`${baseId}-van-filter-${facet.key}`}
      label={facet.label}
      onChange={handleCheckedChange}
    />
  );
};

type VanStateFilterSectionProps = Prettify<
  FilterBaseId &
    VanStateFilterChange & {
      facets: readonly VanStateFilterFacet[];
    }
>;

const VanStateFilterSection = ({
  baseId,
  facets,
  onCheckedChange,
}: VanStateFilterSectionProps) => (
  <fieldset
    className={cx(
      grid({
        columns: { lg: 1, sm: 2 },
        gap: "1",
      }),
      css({
        padding: "1",
        paddingBlockStart: "3",
      })
    )}
  >
    <legend
      className={css({
        fontSize: "sm",
        fontWeight: "medium",
        paddingBlock: "1.5",
        paddingInline: "2",
      })}
    >
      State Filters
    </legend>
    {facets.map((facet) => (
      <VanStateFilterRow
        baseId={baseId}
        facet={facet}
        key={facet.key}
        onCheckedChange={onCheckedChange}
      />
    ))}
  </fieldset>
);

export { VanStateFilterSection };
