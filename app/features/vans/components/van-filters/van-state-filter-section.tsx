import { cn } from "~/utils/utils";
import { FilterCheckboxRow } from "./filter-checkbox-row";

const STATE_FILTERS = [
  {
    key: "excludeInRepair" as const,
    label: "Exclude in repair",
  },
  {
    key: "onlyOnSale" as const,
    label: "Only on sale",
  },
] as const;

interface VanStateFilterSectionProps {
  baseId: string;
  onlyOnSale: boolean | null;
  onSetExcludeInRepair: (checked: boolean) => void;
  onSetOnlyOnSale: (checked: boolean) => void;
  optimisticExcludeInRepair: boolean;
  optimisticOnlyOnSale: boolean;
}

const VanStateFilterSection = ({
  baseId,
  optimisticExcludeInRepair,
  optimisticOnlyOnSale,
  onlyOnSale,
  onSetExcludeInRepair,
  onSetOnlyOnSale,
}: VanStateFilterSectionProps) => {
  const values = {
    excludeInRepair: optimisticExcludeInRepair,
    onlyOnSale: optimisticOnlyOnSale,
  } as const;

  const setters = {
    excludeInRepair: onSetExcludeInRepair,
    onlyOnSale: onSetOnlyOnSale,
  } as const;

  return (
    <div className="p-1">
      <p className="px-2 py-1.5 font-medium text-sm">State Filters</p>
      {STATE_FILTERS.map(({ key, label }) => (
        <FilterCheckboxRow
          checked={values[key]}
          className={cn(
            key === "onlyOnSale" &&
              optimisticOnlyOnSale !== onlyOnSale &&
              "opacity-75"
          )}
          id={`${baseId}-van-filter-${key}`}
          key={key}
          label={label}
          onCheckedChange={setters[key]}
        />
      ))}
    </div>
  );
};

export { VanStateFilterSection };
