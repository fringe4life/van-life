import type { Prettify } from "~/types";
import { cn } from "~/utils/utils";
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
      className={cn(facet.isPending && "opacity-75")}
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
  <fieldset className="grid gap-1 p-1 pt-3 sm:grid-cols-2 lg:grid-cols-1">
    <legend className="px-2 py-1.5 font-medium text-sm">State Filters</legend>
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
