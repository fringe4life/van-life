import { debounce, defaultRateLimit } from 'nuqs';
import { DEFAULT_DEBOUNCE } from '~/constants/constants';
import { VAN_TYPE_LOWERCASE } from '~/features/vans/constants/van-types';
import type { LowercaseVanType } from '~/features/vans/types';

export interface VanFilterUrlState {
	excludeInRepair: boolean;
	onlyOnSale: boolean;
	types: LowercaseVanType[];
}

export interface VanFilterUrlSnapshotInput {
	excludeInRepair: boolean | null | undefined;
	onlyOnSale: boolean | null | undefined;
	types: string[] | null | undefined;
}

export const toValidTypes = (
	types: string[] | null | undefined
): LowercaseVanType[] =>
	(types ?? []).filter((t): t is LowercaseVanType =>
		VAN_TYPE_LOWERCASE.includes(t as LowercaseVanType)
	);

export const snapshotFilterState = (
	urlState: VanFilterUrlSnapshotInput
): VanFilterUrlState => ({
	types: toValidTypes(urlState.types),
	excludeInRepair: urlState.excludeInRepair ?? false,
	onlyOnSale: urlState.onlyOnSale ?? false,
});

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
