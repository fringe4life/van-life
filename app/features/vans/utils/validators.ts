import type { LowercaseVanType } from '~/features/vans/types';
import { VanType } from '~/generated/prisma/enums';
import { VAN_TYPE_LOWERCASE } from '../constants/van-types';

/**
 * Type guard to check if a string is a valid VanType
 * @param value - The value to check
 * @returns True if the value is a valid VanType, false otherwise
 */
function isValidVanType(value: string): value is VanType {
	return Object.values(VanType).includes(value as VanType);
}

/**
 * Validates and returns a valid VanType, defaulting to "SIMPLE" if invalid
 * @param type - The type value to validate
 * @returns A valid VanType or "SIMPLE"
 */
export function validateVanType(type: string): VanType {
	return isValidVanType(type) ? type : VanType.SIMPLE;
}

const lowercaseVanTypes: LowercaseVanType[] = [...VAN_TYPE_LOWERCASE];
/**
 * Type guard to check if a string is a valid lowercase VanType
 * @param value - The value to check
 * @returns True if the value is a valid LowercaseVanType, false otherwise
 */
function isValidLowercaseVanType(value: string): value is LowercaseVanType {
	return lowercaseVanTypes.includes(value as LowercaseVanType);
}

/**
 * Validates and returns a valid LowercaseVanType, defaulting to undefined if invalid
 * @param type - The type value to validate
 * @returns A valid LowercaseVanType or undefined
 */
export function validateLowercaseVanType(type: string): LowercaseVanType {
	return isValidLowercaseVanType(type) ? type : 'simple';
}

/**
 * Converts a VanType to its lowercase equivalent
 * @param vanType - The VanType to convert
 * @returns The lowercase version of the VanType
 */
export function toLowercaseVanType(vanType: VanType): LowercaseVanType {
	return vanType.toLowerCase() as LowercaseVanType;
}
