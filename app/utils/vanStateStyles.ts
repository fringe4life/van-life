import type { VanModel } from '~/generated/prisma/models';
import { getVanStateDataSlot } from './vanStateHelpers';

/**
 * Generates Tailwind CSS classes for van state styling
 * @param van - The van model
 * @returns Object containing data-slot and className for van state styling
 */
export function getVanStateStyles(van: VanModel) {
	const dataSlot = getVanStateDataSlot(van);

	// Base van state styling classes using custom variants
	const vanStateClasses = [
		'van-new:border-2',
		'van-new:border-van-new',
		'van-new:bg-van-new/10',
		'van-repair:border-2',
		'van-repair:border-van-repair',
		'van-repair:bg-van-repair/10',
		'van-sale:border-2',
		'van-sale:border-van-sale',
		'van-sale:bg-van-sale/10',
	].join(' ');

	return {
		dataSlot,
		className: vanStateClasses,
	};
}
