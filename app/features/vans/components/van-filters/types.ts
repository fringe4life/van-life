import type { LowercaseVanType } from "~/features/vans/types";
import type { Prettify } from "~/types";
import type { VanStateFilterKey } from "./van-state-filter-config";

/** Shared `useId()` prefix for filter checkbox ids. */
export interface FilterBaseId {
  baseId: string;
}

/** Static facet definition (key + label). */
interface VanStateFilterDef {
  key: VanStateFilterKey;
  label: string;
}

/** Runtime facet: definition + optimistic UI state. */
export type VanStateFilterFacet = Prettify<
  VanStateFilterDef & {
    checked: boolean;
    isPending: boolean;
  }
>;

/** Shared by state filter section + row. */
export interface VanStateFilterChange {
  onCheckedChange: (key: VanStateFilterKey, checked: boolean) => void;
}

/** Shared by type filter section + row. */
export interface VanTypeFilterToggle {
  onToggle: (type: LowercaseVanType) => void;
}

/** Shared by type filter section + row. */
export interface VanTypeFilterSelection {
  types: LowercaseVanType[];
}
