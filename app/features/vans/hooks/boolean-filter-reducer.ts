type BooleanFilterAction = { type: "reset" } | { type: "toggle" };

const booleanFilterReducer = (
  state: boolean,
  action: BooleanFilterAction
): boolean => (action.type === "reset" ? false : !state);

export { booleanFilterReducer };
