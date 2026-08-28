import { VAN_TYPE_LOWERCASE } from "~/features/vans/constants/van-types";
import type { LowercaseVanType } from "~/features/vans/types";
import type { Prettify } from "~/types";
import { FilterCheckboxRow } from "./filter-checkbox-row";
import type {
  FilterBaseId,
  VanTypeFilterSelection,
  VanTypeFilterToggle,
} from "./types";

type VanTypeFilterRowProps = Prettify<
  FilterBaseId &
    VanTypeFilterToggle &
    VanTypeFilterSelection & {
      type: LowercaseVanType;
    }
>;

const VanTypeFilterRow = ({
  baseId,
  type,
  types,
  onToggle,
}: VanTypeFilterRowProps) => {
  const handleCheckedChange = () => {
    onToggle(type);
  };

  return (
    <FilterCheckboxRow
      checked={types.includes(type)}
      id={`${baseId}-van-filter-type-${type}`}
      label={type}
      labelClassName="capitalize"
      onChange={handleCheckedChange}
    />
  );
};

type VanTypeFilterSectionProps = Prettify<
  FilterBaseId & VanTypeFilterToggle & VanTypeFilterSelection
>;

const VanTypeFilterSection = ({
  baseId,
  types,
  onToggle,
}: VanTypeFilterSectionProps) => (
  <fieldset className="grid gap-1 border-border border-b p-1 pb-3 sm:grid-cols-3 lg:grid-cols-1">
    <legend className="px-2 py-1.5 font-medium text-sm">Van Types</legend>
    {VAN_TYPE_LOWERCASE.map((type) => (
      <VanTypeFilterRow
        baseId={baseId}
        key={type}
        onToggle={onToggle}
        type={type}
        types={types}
      />
    ))}
  </fieldset>
);

export { VanTypeFilterSection };
