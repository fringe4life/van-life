import { useCallback } from "react";
import { css } from "styled-system/css/css";
import { cx } from "styled-system/css/cx";
import { grid } from "styled-system/patterns";
import { VanType } from "~/db/enums";
import { VAN_TYPE_VALUES } from "~/features/vans/schema";
import type { Prettify } from "~/types";
import { FilterOption, type FilterTone } from "./filter-option";
import type { VanTypeFilterSelection, VanTypeFilterToggle } from "./types";

type VanTypeFilterSectionProps = Prettify<
  VanTypeFilterToggle & VanTypeFilterSelection
>;

type VanTypeFilterRowProps = Prettify<
  VanTypeFilterToggle &
    VanTypeFilterSelection & {
      type: VanType;
    }
>;

/** The badge each type already wears, so the key and the swatch stay one colour. */
const toneByType = {
  [VanType.LUXURY]: "luxury",
  [VanType.RUGGED]: "rugged",
  [VanType.SIMPLE]: "simple",
} as const satisfies Record<VanType, FilterTone>;

/*
 * A fieldset still names the group and still owns the legend, but the default
 * border and padding belong to the rail's rhythm, not to the compact panel.
 * Both are reset here and restored from `lg`.
 */
const sectionClassName = css({
  borderWidth: "0",
  margin: "0",
  minInlineSize: "0",
  padding: "0",
});

/*
 * Two captions for two layouts: a tracked micro-caption in the compact panel,
 * where it sits beside another group, and the rail's own legend at `lg`. The
 * tracking is what lets an 11px caption sit above 14px rows without competing
 * with them.
 */
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
  /*
   * The same inset the row gives its key, so the caption sits over the keys
   * rather than over the tint's edge.
   */
  paddingInlineStart: "2",
  textTransform: "uppercase",
});

/*
 * `VanType` stores the enum as an upper-case literal; the catalog writes it in
 * lower case everywhere it is read (card badge, filter row). The transform stays
 * on the label, not on the value, so the URL keeps the literal the schema parses.
 */
const typeLabelClassName = css({
  "& [data-filter-label]": {
    textTransform: "lowercase",
  },
});

const VanTypeFilterRow = ({ type, types, onToggle }: VanTypeFilterRowProps) => {
  const handleChange = useCallback(() => {
    onToggle(type);
  }, [onToggle, type]);

  return (
    <FilterOption
      checked={types.includes(type)}
      className={typeLabelClassName}
      label={type}
      onChange={handleChange}
      tone={toneByType[type]}
    />
  );
};

const VanTypeFilterSection = ({
  types,
  onToggle,
}: VanTypeFilterSectionProps) => (
  <fieldset
    className={cx(
      sectionClassName,
      grid({
        /*
         * One column in the compact half-panel and in the rail. Three columns
         * at `md` assumed a 3rem gutter had created room; that gutter ate the
         * 768–1023 band instead, and "rugged" plus its key crowded (~109px).
         */
        columns: 1,
        gap: "0.5",
      })
    )}
  >
    <legend className={legendClassName}>Van Types</legend>
    {VAN_TYPE_VALUES.map((type) => (
      <VanTypeFilterRow
        key={type}
        onToggle={onToggle}
        type={type}
        types={types}
      />
    ))}
  </fieldset>
);

export { VanTypeFilterSection };
