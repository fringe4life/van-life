const booleanFilterReducer = (state: boolean, _action: { type: "toggle" }) =>
  !state;

export { booleanFilterReducer };
