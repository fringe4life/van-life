import { debounce, defaultRateLimit } from "nuqs";
import { DEFAULT_DEBOUNCE } from "~/constants/constants";
import type { VanType } from "~/db/enums";
import { toValidTypes } from "~/features/vans/schema";
import type { List, Maybe } from "~/types";

export interface VanFilterUrlState {
  excludeInRepair: boolean;
  onlyOnSale: boolean;
  types: VanType[];
}

interface VanFilterUrlSnapshotInput {
  excludeInRepair: Maybe<boolean>;
  onlyOnSale: Maybe<boolean>;
  types: List<string>;
}

export const snapshotFilterState = (
  urlState: VanFilterUrlSnapshotInput
): VanFilterUrlState => ({
  excludeInRepair: urlState.excludeInRepair ?? false,
  onlyOnSale: urlState.onlyOnSale ?? false,
  types: toValidTypes(urlState.types),
});

export const activeFilterCount = (state: VanFilterUrlState): number =>
  state.types.length +
  (state.excludeInRepair ? 1 : 0) +
  (state.onlyOnSale ? 1 : 0);

export const isRemovingFilter = (
  current: VanFilterUrlState,
  next: VanFilterUrlState
): boolean => activeFilterCount(next) < activeFilterCount(current);

export const getLimitUrlUpdates = (isRemoving: boolean) =>
  isRemoving ? defaultRateLimit : debounce(DEFAULT_DEBOUNCE);
