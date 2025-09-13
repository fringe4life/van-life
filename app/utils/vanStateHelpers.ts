import { SIX_MONTHS } from '~/constants/timeConstants';
import type { VanModel } from '~/generated/prisma/models';

// Constants for time calculations
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const MILLISECONDS_PER_SECOND = 1000;
const DAYS_PER_MONTH = 30;

const MILLISECONDS_PER_DAY =
	MILLISECONDS_PER_SECOND *
	SECONDS_PER_MINUTE *
	MINUTES_PER_HOUR *
	HOURS_PER_DAY;

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

	// Debug logging for van state determination
	// biome-ignore lint/suspicious/noConsole: Debug logging for development
	console.log('🔍 [vanStateHelpers] isVanNew check:', {
		createdAt: createdAt.toISOString(),
		sixMonthsAgo: sixMonthsAgo.toISOString(),
		isNew,
		monthsSinceCreation: Math.floor(
			(now.getTime() - new Date(createdAt).getTime()) /
				(MILLISECONDS_PER_DAY * DAYS_PER_MONTH)
		),
	});

	return isNew;
}

/**
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

	// Debug logging for data attribute generation
	// biome-ignore lint/suspicious/noConsole: Debug logging for development
	console.log('🎨 [vanStateHelpers] getVanStateDataAttributes:', {
		vanId: van.id,
		vanName: van.name,
		vanState: van.state,
		isNew,
		dataAttributes: attributes,
	});

	return attributes;
}
