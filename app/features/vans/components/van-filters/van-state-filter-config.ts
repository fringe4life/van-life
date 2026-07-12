import type { VanFilterUrlState } from "~/features/vans/utils/van-filter-url";

export const VAN_STATE_FILTERS = [
  {
    key: "excludeInRepair",
    label: "Exclude in repair",
  },
  {
    key: "onlyOnSale",
    label: "Only on sale",
  },
] as const satisfies ReadonlyArray<{
  key: keyof Pick<VanFilterUrlState, "excludeInRepair" | "onlyOnSale">;
  label: string;
}>;

export type VanStateFilterKey = (typeof VAN_STATE_FILTERS)[number]["key"];
