const booleanFilterReducer = (state: boolean, _action: { type: 'toggle' }) => {
	return !state;
};

export { booleanFilterReducer };
