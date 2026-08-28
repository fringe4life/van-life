import type { LowercaseVanType } from "~/features/vans/types";

type TypesFilterAction = { type: "reset" } | { type: LowercaseVanType };

const typesFilterReducer = (
  state: LowercaseVanType[],
  action: TypesFilterAction
): LowercaseVanType[] => {
  if (action.type === "reset") {
    return [];
  }

  if (state.includes(action.type)) {
    return state.filter((t) => t !== action.type);
  }
  return [...state, action.type];
};

export { typesFilterReducer };
