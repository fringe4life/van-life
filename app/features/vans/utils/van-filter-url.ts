import { debounce, defaultRateLimit } from 'nuqs';
import { DEFAULT_DEBOUNCE } from '~/constants/constants';
import type { LowercaseVanType } from '~/features/vans/types';

export interface VanFilterUrlState {
	excludeInRepair: boolean;
	onlyOnSale: boolean;
	types: LowercaseVanType[];
}

export const activeFilterCount = (state: VanFilterUrlState): number =>
	state.types.length +
	(state.excludeInRepair ? 1 : 0) +
	(state.onlyOnSale ? 1 : 0);

export const isRemovingFilter = (
	current: VanFilterUrlState,
	next: VanFilterUrlState
): boolean => activeFilterCount(next) < activeFilterCount(current);

export const getLimitUrlUpdates = (isRemoving: boolean) =>
	isRemoving ? defaultRateLimit : debounce(DEFAULT_DEBOUNCE);
