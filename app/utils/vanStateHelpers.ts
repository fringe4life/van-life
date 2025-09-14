import { SIX_MONTHS } from '~/constants/timeConstants';
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
 * Generates data-slot attribute for van state styling using shadcn data-slot system
 * @param van - The van model
 * @returns The data-slot value for CSS targeting
 */
export function getVanStateDataSlot(van: VanModel): string {
	const isNew = isVanNew(van.createdAt);

	// Determine the state for data-slot attribute
	let state: string;
	if (isNew) {
		state = 'new';
	} else if (van.state === 'IN_REPAIR') {
		state = 'repair';
	} else if (van.state === 'ON_SALE') {
		state = 'sale';
	} else {
		state = 'available';
	}

	const dataSlot = `van-card-${state}`;

	return dataSlot;
}

/**
 * @deprecated Use getVanStateDataSlot instead. This function is kept for backward compatibility.
 * Generates data attributes for van state styling using Tailwind v4 custom variants
 * @param van - The van model
 * @returns Object with data attributes for styling
 */
export function getVanStateDataAttributes(
	van: VanModel
): Record<string, string | boolean> {
	const isNew = isVanNew(van.createdAt);
	const attributes: Record<string, string | boolean> = {};

	// Build data attributes using Tailwind v4 format: data-[attribute=value]
	// Use a single data-state attribute with different values
	if (isNew) {
		attributes['data-state'] = 'new';
	} else if (van.state === 'IN_REPAIR') {
		attributes['data-state'] = 'repair';
	} else if (van.state === 'ON_SALE') {
		attributes['data-state'] = 'sale';
	}

	return attributes;
}
