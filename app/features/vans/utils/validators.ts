// ============================================================================
// VAN TYPE VALIDATORS
// ============================================================================

import { DEFAULT_FILTER } from '~/features/pagination/pagination-constants';
import type {
	LowercaseVanType,
	MaybeTypeFilter,
	VanTypeOrEmpty,
} from '~/features/vans/types';
import { VanState, VanType } from '~/generated/prisma/enums';
import type { Maybe } from '~/types/types';

/**
 * Type guard to check if a string is a valid VanType
 * @param value - The value to check
 * @returns True if the value is a valid VanType, false otherwise
 */
export function isValidVanType(value: string): value is VanType {
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

const lowercaseVanTypes: LowercaseVanType[] = ['simple', 'rugged', 'luxury'];
/**
 * Type guard to check if a string is a valid lowercase VanType
 * @param value - The value to check
 * @returns True if the value is a valid LowercaseVanType, false otherwise
 */
export function isValidLowercaseVanType(
	value: string
): value is LowercaseVanType {
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
 * Type guard to check if a string is a valid VanTypeOrEmpty (includes empty string)
 * @param value - The value to check
 * @returns True if the value is a valid VanTypeOrEmpty, false otherwise
 */
export function isValidVanTypeOrEmpty(value: string): value is VanTypeOrEmpty {
	return value === '' || isValidLowercaseVanType(value);
}

/**
 * Validates and returns a valid VanTypeOrEmpty, defaulting to DEFAULT_FILTER if invalid
 * @param type - The type value to validate
 * @returns A valid VanTypeOrEmpty
 */
export function validateVanTypeOrEmpty(type: string): VanTypeOrEmpty {
	return isValidVanTypeOrEmpty(type)
		? (type as VanTypeOrEmpty)
		: DEFAULT_FILTER;
}

/**
 * Converts a VanType to its lowercase equivalent
 * @param vanType - The VanType to convert
 * @returns The lowercase version of the VanType
 */
export function toLowercaseVanType(vanType: VanType): LowercaseVanType {
	return vanType.toLowerCase() as LowercaseVanType;
}

/**
 * Converts a string to VanType if it's a valid lowercase van type
 * @param type - The string to convert
 * @returns The VanType or undefined if invalid
 */
export function toVanType(type: string): MaybeTypeFilter {
	if (!isValidLowercaseVanType(type)) {
		return;
	}
	return type.toUpperCase() as VanType;
}

// ============================================================================
// VAN STATE VALIDATORS
// ============================================================================

/**
 * Type guard to check if a string is a valid VanState
 * @param value - The value to check
 * @returns True if the value is a valid VanState, false otherwise
 */
export function isValidVanState(value: string): value is VanState {
	return Object.values(VanState).includes(value as VanState);
}

/**
 * Validates and returns a valid VanState, defaulting to 'AVAILABLE' if invalid
 * @param state - The state value to validate
 * @returns A valid VanState
 */
export function validateVanState(state: Maybe<string>): VanState {
	const stateString = state ?? '';
	return isValidVanState(stateString) ? stateString : VanState.AVAILABLE;
}
