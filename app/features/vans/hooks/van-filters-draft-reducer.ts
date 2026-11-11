import type { VanType } from "~/db/enums";
import type { VanStateFilterKey } from "~/features/vans/components/van-filters/van-state-filter-config";
import type { VanFilterUrlState } from "~/features/vans/utils/van-filter-url";

type VanFiltersDraftAction =
  | { type: "hydrate"; state: VanFilterUrlState }
  | { type: "toggleType"; vanType: VanType }
  | { type: "setState"; key: VanStateFilterKey; checked: boolean }
  | { type: "clear" };

const EMPTY_FILTER_STATE: VanFilterUrlState = {
  excludeInRepair: false,
  onlyOnSale: false,
  types: [],
};

/** Stable key for comparing draft vs URL (order-sensitive types list). */
const filterStateKey = (state: VanFilterUrlState): string =>
  JSON.stringify(state);

const vanFiltersDraftReducer = (
  state: VanFilterUrlState,
  action: VanFiltersDraftAction
): VanFilterUrlState => {
  switch (action.type) {
    case "hydrate":
      return action.state;
    case "toggleType": {
      const has = state.types.includes(action.vanType);
      return {
        ...state,
        types: has
          ? state.types.filter((t) => t !== action.vanType)
          : [...state.types, action.vanType],
      };
    }
    case "setState":
      return { ...state, [action.key]: action.checked };
    case "clear":
      return EMPTY_FILTER_STATE;
    default:
      return state;
  }
};

export type { VanFiltersDraftAction };
export { EMPTY_FILTER_STATE, filterStateKey, vanFiltersDraftReducer };
