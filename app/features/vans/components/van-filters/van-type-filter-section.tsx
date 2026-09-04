import { css, cx } from "styled-system/css";
import { grid } from "styled-system/patterns";
import type { VanType } from "~/db/enums";
import { VAN_TYPE_VALUES } from "~/features/vans/schema";
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
      type: VanType;
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
      labelClassName={css({ textTransform: "lowercase" })}
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
  <fieldset
    className={cx(
      grid({
        columns: { lg: 1, sm: 3 },
        gap: "1",
      }),
      css({
        borderBottomWidth: "thin",
        borderColor: "border",
        padding: "1",
        paddingBlockEnd: "3",
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
      Van Types
    </legend>
    {VAN_TYPE_VALUES.map((type) => (
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
