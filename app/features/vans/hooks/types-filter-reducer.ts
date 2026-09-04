import type { VanType } from "~/db/enums";

type TypesFilterAction = { type: "reset" } | { type: VanType };

const typesFilterReducer = (
  state: VanType[],
  action: TypesFilterAction
): VanType[] => {
  if (action.type === "reset") {
    return [];
  }

  if (state.includes(action.type)) {
    return state.filter((t) => t !== action.type);
  }
  return [...state, action.type];
};

export { typesFilterReducer };
