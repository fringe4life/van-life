import { debounce, defaultRateLimit } from "nuqs";
import { DEFAULT_DEBOUNCE } from "~/constants/constants";
import { VAN_TYPE_LOWERCASE } from "~/features/vans/constants/van-types";
import type { LowercaseVanType } from "~/features/vans/types";
import type { List, Maybe } from "~/types";

export interface VanFilterUrlState {
  excludeInRepair: boolean;
  onlyOnSale: boolean;
  types: LowercaseVanType[];
}

interface VanFilterUrlSnapshotInput {
  excludeInRepair: Maybe<boolean>;
  onlyOnSale: Maybe<boolean>;
  types: List<string>;
}

export const toValidTypes = (types: List<string>): LowercaseVanType[] =>
  (types ?? []).filter((t): t is LowercaseVanType =>
    VAN_TYPE_LOWERCASE.includes(t as LowercaseVanType)
  );

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
