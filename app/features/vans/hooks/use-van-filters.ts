import { useQueryStates } from "nuqs";
import {
  startTransition as startReactTransition,
  type TransitionStartFunction,
  useReducer,
  useState,
} from "react";
import type { VanType } from "~/db/enums";
import {
  VAN_STATE_FILTERS,
  type VanStateFilterKey,
} from "~/features/vans/components/van-filters/van-state-filter-config";
import {
  filterStateKey,
  vanFiltersDraftReducer,
} from "~/features/vans/hooks/van-filters-draft-reducer";
import { vansFilterUrlParsers } from "~/features/vans/parsers";
import {
  activeFilterCount,
  snapshotFilterState,
  type VanFilterUrlState,
} from "~/features/vans/utils/van-filter-url";
import {
  DEFAULT_CURSOR,
  DEFAULT_DIRECTION,
} from "~/pagination/pagination-constants";

const useVanFilters = (
  startTransition: TransitionStartFunction = startReactTransition
) => {
  const [urlState, setUrlState] = useQueryStates(vansFilterUrlParsers, {
    startTransition,
  });

  const committed = snapshotFilterState(urlState);
  const committedKey = filterStateKey(committed);

  const [draft, dispatch] = useReducer(vanFiltersDraftReducer, committed);
  const draftKey = filterStateKey(draft);
  const [seenUrlKey, setSeenUrlKey] = useState(committedKey);

  // Sync URL → draft during render (no refs — React Compiler).
  // Our own clicks update draft first; committed lags until navigation lands.
  // Back/forward changes committed away from draft → hydrate.
  if (committedKey === draftKey) {
    if (seenUrlKey !== committedKey) {
      setSeenUrlKey(committedKey);
    }
  } else if (committedKey !== seenUrlKey) {
    setSeenUrlKey(committedKey);
    dispatch({ state: committed, type: "hydrate" });
  }

  const pushUrl = (next: VanFilterUrlState) => {
    startTransition(async () => {
      await setUrlState({
        ...next,
        cursor: DEFAULT_CURSOR,
        direction: DEFAULT_DIRECTION,
      });
    });
  };

  const toggleType = (type: VanType) => {
    const action = { type: "toggleType" as const, vanType: type };
    const next = vanFiltersDraftReducer(draft, action);
    dispatch(action);
    pushUrl(next);
  };

  const setStateFilter = (key: VanStateFilterKey, checked: boolean) => {
    const action = { checked, key, type: "setState" as const };
    const next = vanFiltersDraftReducer(draft, action);
    dispatch(action);
    pushUrl(next);
  };

  const clearFilters = () => {
    const action = { type: "clear" as const };
    const next = vanFiltersDraftReducer(draft, action);
    dispatch(action);
    pushUrl(next);
  };

  const stateFacets = VAN_STATE_FILTERS.map(({ key, label }) => ({
    checked: draft[key],
    isPending: draft[key] !== committed[key],
    key,
    label,
  }));

  return {
    badgeCount: activeFilterCount(draft),
    clearFilters,
    optimisticTypes: draft.types,
    setStateFilter,
    stateFacets,
    toggleType,
  } as const;
};

export { useVanFilters };
