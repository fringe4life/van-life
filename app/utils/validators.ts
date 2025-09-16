import {
	DEFAULT_CURSOR,
	DEFAULT_DIRECTION,
	DEFAULT_FILTER,
	DEFAULT_LIMIT,
	DEFAULT_SORT,
	DIRECTIONS,
	LIMITS,
	SORT_OPTIONS,
} from '~/features/pagination/pagination-constants';
import { TransactionType, VanState, VanType } from '~/generated/prisma/enums';
import type {
	Direction,
	LowercaseVanType,
	SortOption,
	VanTypeOrEmpty,
} from '~/types/types';

// ============================================================================
// PAGINATION VALIDATORS
// ============================================================================

/**
 * Type guard to check if a number is a valid limit value
 * @param value - The value to check
 * @returns True if the value is in the LIMITS array, false otherwise
 */
export function isValidLimit(value: number): value is (typeof LIMITS)[number] {
	return LIMITS.includes(value as (typeof LIMITS)[number]);
}

/**
 * Validates and returns a valid limit value, defaulting to DEFAULT_LIMIT if invalid
 * @param limit - The limit value to validate
 * @returns A valid limit value from the LIMITS array
 */
export function validateLimit(limit: number): (typeof LIMITS)[number] {
	return isValidLimit(limit) ? limit : DEFAULT_LIMIT;
}

/**
 * Type guard to check if a string is a valid direction
 * @param value - The value to check
 * @returns True if the value is a valid direction, false otherwise
 */
export function isValidDirection(value: string): value is Direction {
	return DIRECTIONS.includes(value as Direction);
}

/**
 * Validates and returns a valid direction, defaulting to DEFAULT_DIRECTION if invalid
 * @param direction - The direction value to validate
 * @returns A valid direction
 */
export function validateDirection(direction: string): Direction {
	return isValidDirection(direction) ? direction : DEFAULT_DIRECTION;
}

/**
 * Type guard to check if a string is a valid sort option
 * @param value - The value to check
 * @returns True if the value is a valid sort option, false otherwise
 */
export function isValidSortOption(value: string): value is SortOption {
	return SORT_OPTIONS.includes(value as SortOption);
}

/**
 * Validates and returns a valid sort option, defaulting to DEFAULT_SORT if invalid
 * @param sort - The sort value to validate
 * @returns A valid sort option
 */
export function validateSortOption(sort: string): SortOption {
	return isValidSortOption(sort) ? sort : DEFAULT_SORT;
}

// ============================================================================
// VAN TYPE VALIDATORS
// ============================================================================

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
	return isValidVanType(type) ? type : 'SIMPLE';
}

/**
 * Type guard to check if a string is a valid lowercase VanType
 * @param value - The value to check
 * @returns True if the value is a valid LowercaseVanType, false otherwise
 */
export function isValidLowercaseVanType(
	value: string
): value is LowercaseVanType {
	const lowercaseVanTypes: LowercaseVanType[] = ['simple', 'rugged', 'luxury'];
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
export function toVanType(type: string): VanType | undefined {
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
export function validateVanState(state: string | null): VanState {
	const stateString = state ?? '';
	return isValidVanState(stateString) ? stateString : 'AVAILABLE';
}

// ============================================================================
// TRANSACTION TYPE VALIDATORS
// ============================================================================

/**
 * Type guard to check if a string is a valid TransactionType
 * @param value - The value to check
 * @returns True if the value is a valid TransactionType, false otherwise
 */
export function isValidTransactionType(
	value: string
): value is TransactionType {
	return Object.values(TransactionType).includes(value as TransactionType);
}

/**
 * Validates and returns a valid TransactionType, defaulting to 'DEPOSIT' if invalid
 * @param type - The type value to validate
 * @returns A valid TransactionType
 */
export function validateTransactionType(type: string): TransactionType {
	return isValidTransactionType(type) ? type : 'DEPOSIT';
}

// ============================================================================
// CURSOR VALIDATORS
// ============================================================================

/**
 * Type guard to check if a string is a valid cursor (non-empty string)
 * @param value - The value to check
 * @returns True if the value is a valid cursor, false otherwise
 */
export function isValidCursor(value: string): boolean {
	return value !== '' && value !== null && value !== undefined;
}

/**
 * Validates and returns a valid cursor, defaulting to DEFAULT_CURSOR if invalid
 * @param cursor - The cursor value to validate
 * @returns A valid cursor
 */
export function validateCursor(cursor: string): string {
	return isValidCursor(cursor) ? cursor : DEFAULT_CURSOR;
}

// ============================================================================
// ARRAY VALIDATORS
// ============================================================================

/**
 * Type guard to check if a value is a valid array
 * @param value - The value to check
 * @returns True if the value is an array, false otherwise
 */
export function isValidArray<T>(value: unknown): value is T[] {
	return Array.isArray(value);
}

/**
 * Validates and returns a valid array, defaulting to empty array if invalid
 * @param value - The value to validate
 * @returns A valid array
 */
export function validateArray<T>(value: unknown): T[] {
	return isValidArray<T>(value) ? value : [];
}

// ============================================================================
// QUERY TYPE VALIDATORS
// ============================================================================

/**
 * Type guard to check if a value is a valid QueryType (not a string error)
 * @param value - The value to check
 * @returns True if the value is not a string (error), false otherwise
 */
export function isValidQueryType<T>(value: unknown): value is T {
	return typeof value !== 'string';
}

/**
 * Validates and returns a valid QueryType, defaulting to undefined if invalid
 * @param value - The value to validate
 * @returns A valid QueryType or undefined
 */
export function validateQueryType<T>(value: unknown): T | undefined {
	return isValidQueryType<T>(value) ? value : undefined;
}
