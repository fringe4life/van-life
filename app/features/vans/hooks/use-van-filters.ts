import { useQueryStates } from "nuqs";
import {
  startTransition as startReactTransition,
  type TransitionStartFunction,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import type { VanType } from "~/db/enums";
import {
  VAN_STATE_FILTERS,
  type VanStateFilterKey,
} from "~/features/vans/components/van-filters/van-state-filter-config";
import {
  filterStateKey,
  planUrlDraftSync,
  type VanFiltersDraftAction,
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
  const draftRef = useRef(draft);
  useEffect(() => {
    draftRef.current = draft;
  }, [draft]);

  const [seenUrlKey, setSeenUrlKey] = useState(committedKey);
  const [authoredKeys, setAuthoredKeys] = useState(() => new Set<string>());

  // Sync URL → draft during render (React 19). Authored keys skip hydrate so
  // intermediate navigations from rapid clicks do not wipe later draft facets.
  const syncPlan = planUrlDraftSync({
    authoredKeys,
    committedKey,
    draftKey,
    seenUrlKey,
  });
  if (syncPlan.kind === "catchUp") {
    setSeenUrlKey(syncPlan.seenUrlKey);
    if (authoredKeys.size > 0) {
      setAuthoredKeys(new Set());
    }
  } else if (syncPlan.kind === "authoredCommit") {
    setSeenUrlKey(syncPlan.seenUrlKey);
  } else if (syncPlan.kind === "hydrate") {
    setSeenUrlKey(syncPlan.seenUrlKey);
    if (authoredKeys.size > 0) {
      setAuthoredKeys(new Set());
    }
    dispatch({ state: committed, type: "hydrate" });
  }

  const pushUrl = (next: VanFilterUrlState) => {
    const key = filterStateKey(next);
    setAuthoredKeys((prev) => {
      if (prev.has(key)) {
        return prev;
      }
      const nextKeys = new Set(prev);
      nextKeys.add(key);
      return nextKeys;
    });
    startTransition(async () => {
      await setUrlState({
        ...next,
        cursor: DEFAULT_CURSOR,
        direction: DEFAULT_DIRECTION,
      });
    });
  };

  const applyDraftAction = (action: VanFiltersDraftAction) => {
    const next = vanFiltersDraftReducer(draftRef.current, action);
    draftRef.current = next;
    dispatch(action);
    pushUrl(next);
  };

  const toggleType = (type: VanType) => {
    applyDraftAction({ type: "toggleType", vanType: type });
  };

  const setStateFilter = (key: VanStateFilterKey, checked: boolean) => {
    applyDraftAction({ checked, key, type: "setState" });
  };

  const clearFilters = () => {
    applyDraftAction({ type: "clear" });
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
