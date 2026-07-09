import { useQueryStates } from "nuqs";
import { startTransition, useCallback, useId } from "react";
import {
  DEFAULT_CURSOR,
  DEFAULT_DIRECTION,
} from "~/features/pagination/pagination-constants";
import { useOptimisticBooleanFilter } from "~/features/vans/hooks/use-optimistic-boolean-filter";
import { useOptimisticTypesFilter } from "~/features/vans/hooks/use-optimistic-types-filter";
import type { LowercaseVanType } from "~/features/vans/types";
import {
  activeFilterCount,
  getLimitUrlUpdates,
  isRemovingFilter,
  snapshotFilterState,
  toValidTypes,
  type VanFilterUrlState,
} from "~/features/vans/utils/van-filter-url";
import { vansFilterUrlParsers } from "~/lib/parsers";

const useVanFilters = () => {
  const [urlState, setUrlState] = useQueryStates(vansFilterUrlParsers);
  const baseId = useId();

  const { types, excludeInRepair, onlyOnSale } = urlState;
  const validTypes = toValidTypes(types);

  const [optimisticTypes, toggleOptimisticType] =
    useOptimisticTypesFilter(validTypes);
  const [optimisticExcludeInRepair, toggleOptimisticExcludeInRepair] =
    useOptimisticBooleanFilter(excludeInRepair ?? false);
  const [optimisticOnlyOnSale, toggleOptimisticOnlyOnSale] =
    useOptimisticBooleanFilter(onlyOnSale ?? false);

  const getCurrentState = useCallback(
    () => snapshotFilterState(urlState),
    [urlState]
  );

  const commitChange = useCallback(
    (
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
    },
    [getCurrentState, setUrlState]
  );

  const toggleType = useCallback(
    (type: LowercaseVanType) => {
      const current = getCurrentState();
      const newTypes = current.types.includes(type)
        ? current.types.filter((t) => t !== type)
        : [...current.types, type];
      const next: VanFilterUrlState = { ...current, types: newTypes };

      commitChange(next, { types: next.types }, () =>
        toggleOptimisticType(type)
      );
    },
    [commitChange, getCurrentState, toggleOptimisticType]
  );

  const setExcludeInRepair = useCallback(
    (checked: boolean) => {
      const current = getCurrentState();
      const next: VanFilterUrlState = { ...current, excludeInRepair: checked };

      commitChange(next, { excludeInRepair: checked }, () =>
        toggleOptimisticExcludeInRepair({ type: "toggle" })
      );
    },
    [commitChange, getCurrentState, toggleOptimisticExcludeInRepair]
  );

  const setOnlyOnSale = useCallback(
    (checked: boolean) => {
      const current = getCurrentState();
      const next: VanFilterUrlState = { ...current, onlyOnSale: checked };

      commitChange(next, { onlyOnSale: checked }, () =>
        toggleOptimisticOnlyOnSale({ type: "toggle" })
      );
    },
    [commitChange, getCurrentState, toggleOptimisticOnlyOnSale]
  );

  const badgeCount = activeFilterCount({
    excludeInRepair: optimisticExcludeInRepair,
    onlyOnSale: optimisticOnlyOnSale,
    types: optimisticTypes,
  });

  return {
    badgeCount,
    baseId,
    onlyOnSale,
    optimisticExcludeInRepair,
    optimisticOnlyOnSale,
    optimisticTypes,
    setExcludeInRepair,
    setOnlyOnSale,
    toggleType,
  } as const;
};

export { useVanFilters };
