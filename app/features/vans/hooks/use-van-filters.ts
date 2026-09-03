import { defaultRateLimit, useQueryStates } from "nuqs";
import { startTransition, useId } from "react";
import {
  DEFAULT_CURSOR,
  DEFAULT_DIRECTION,
} from "~/features/pagination/pagination-constants";
import {
  VAN_STATE_FILTERS,
  type VanStateFilterKey,
} from "~/features/vans/components/van-filters/van-state-filter-config";
import { useOptimisticBooleanFilter } from "~/features/vans/hooks/use-optimistic-boolean-filter";
import { useOptimisticTypesFilter } from "~/features/vans/hooks/use-optimistic-types-filter";
import { vansFilterUrlParsers } from "~/features/vans/parsers";
import type { LowercaseVanType } from "~/features/vans/types";
import {
  activeFilterCount,
  getLimitUrlUpdates,
  isRemovingFilter,
  snapshotFilterState,
  toValidTypes,
  type VanFilterUrlState,
} from "~/features/vans/utils/van-filter-url";

const useVanFilters = () => {
  const [urlState, setUrlState] = useQueryStates(vansFilterUrlParsers);
  const baseId = useId();

  const { types, excludeInRepair, onlyOnSale } = urlState;
  const validTypes = toValidTypes(types);

  const [optimisticTypes, toggleOptimisticType, resetOptimisticTypes] =
    useOptimisticTypesFilter(validTypes);
  const [
    optimisticExcludeInRepair,
    toggleOptimisticExcludeInRepair,
    resetOptimisticExcludeInRepair,
  ] = useOptimisticBooleanFilter(excludeInRepair ?? false);
  const [
    optimisticOnlyOnSale,
    toggleOptimisticOnlyOnSale,
    resetOptimisticOnlyOnSale,
  ] = useOptimisticBooleanFilter(onlyOnSale ?? false);

  const optimisticByKey = {
    excludeInRepair: optimisticExcludeInRepair,
    onlyOnSale: optimisticOnlyOnSale,
  } as const;

  const committedByKey = {
    excludeInRepair: excludeInRepair ?? false,
    onlyOnSale: onlyOnSale ?? false,
  } as const;

  const toggleOptimisticByKey = {
    excludeInRepair: toggleOptimisticExcludeInRepair,
    onlyOnSale: toggleOptimisticOnlyOnSale,
  } as const;

  const getCurrentState = () => snapshotFilterState(urlState);

  const commitChange = (
    next: VanFilterUrlState,
    urlPatch: Partial<
      Pick<VanFilterUrlState, "types" | "excludeInRepair" | "onlyOnSale">
    >,
    optimisticUpdate: () => void
  ) => {
    const current = getCurrentState();
    const removing = isRemovingFilter(current, next);

    startTransition(async () => {
      optimisticUpdate();
      await setUrlState(
        {
          ...urlPatch,
          cursor: DEFAULT_CURSOR,
          direction: DEFAULT_DIRECTION,
        },
        { limitUrlUpdates: getLimitUrlUpdates(removing) }
      );
    });
  };

  const toggleType = (type: LowercaseVanType) => {
    const current = getCurrentState();
    const newTypes = current.types.includes(type)
      ? current.types.filter((t) => t !== type)
      : [...current.types, type];
    const next: VanFilterUrlState = { ...current, types: newTypes };

    commitChange(next, { types: next.types }, () => toggleOptimisticType(type));
  };

  const setStateFilter = (key: VanStateFilterKey, checked: boolean) => {
    const current = getCurrentState();
    const next: VanFilterUrlState = { ...current, [key]: checked };

    commitChange(next, { [key]: checked }, () => toggleOptimisticByKey[key]());
  };

  const clearFilters = () => {
    startTransition(async () => {
      resetOptimisticTypes();
      resetOptimisticExcludeInRepair();
      resetOptimisticOnlyOnSale();
      await setUrlState(
        {
          cursor: DEFAULT_CURSOR,
          direction: DEFAULT_DIRECTION,
          excludeInRepair: false,
          onlyOnSale: false,
          types: [],
        },
        { limitUrlUpdates: defaultRateLimit }
      );
    });
  };

  const stateFacets = VAN_STATE_FILTERS.map(({ key, label }) => ({
    checked: optimisticByKey[key],
    isPending: optimisticByKey[key] !== committedByKey[key],
    key,
    label,
  }));

  const badgeCount = activeFilterCount({
    excludeInRepair: optimisticExcludeInRepair,
    onlyOnSale: optimisticOnlyOnSale,
    types: optimisticTypes,
  });

  return {
    badgeCount,
    baseId,
    clearFilters,
    optimisticTypes,
    setStateFilter,
    stateFacets,
    toggleType,
  } as const;
};

export { useVanFilters };
