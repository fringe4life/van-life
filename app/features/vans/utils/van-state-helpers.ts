import { SIX_MONTHS } from '~/constants/time-constants';
import type { VanModel } from '~/generated/prisma/models';

/**
 * Determines if a van is considered "new" based on its creation date
 * @param createdAt - The van's creation date
 * @returns True if the van was created within the last 6 months
 */
export function isVanNew(createdAt: VanModel['createdAt']): boolean {
	const now = new Date();
	const sixMonthsAgo = new Date(
		now.getFullYear(),
		now.getMonth() - SIX_MONTHS,
		now.getDate()
	);
	const isNew = new Date(createdAt) > sixMonthsAgo;

	return isNew;
}

/**
 * Gets the lowercase van state
 * @param van - The van model
 * @returns The lowercase state string
 */
export function lowercaseVanState(van: VanModel): string {
	const isNew = isVanNew(van.createdAt);

	// Determine the state
	if (isNew) {
		return 'new';
	}
	if (van.state === 'IN_REPAIR') {
		return 'repair';
	}
	if (van.state === 'ON_SALE') {
		return 'sale';
	}
	return 'available';
}

/**
 * Gets the lowercase van state with processing callback
 * @param van - The van model
 * @param processor - Callback to process the state (e.g., add data-* prefix)
 * @returns The processed state
 */
export function lowercaseVanStateWithProcessor<T>(
	van: VanModel,
	processor: (state: string) => T
): T {
	const state = lowercaseVanState(van);
	return processor(state);
}

/**
 * Determines whether a van is currently available for rent.
 * A van is available when it's not rented and not in repair.
 */
export function isVanAvailable(van: VanModel): boolean {
	return !van.isRented && van.state !== 'IN_REPAIR';
}
