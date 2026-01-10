import type { LowercaseVanType } from '~/features/vans/types';

const typesFilterReducer = (
	state: LowercaseVanType[],
	action: { type: LowercaseVanType }
): LowercaseVanType[] => {
	if (state.includes(action.type)) {
		return state.filter((t) => t !== action.type);
	}
	return [...state, action.type];
};

export { typesFilterReducer };
