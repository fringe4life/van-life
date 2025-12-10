import { TransactionType } from '~/generated/prisma/enums';

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
 * Validates and returns a valid TransactionType, defaulting to 'deposit' if invalid
 * @param type - The type value to validate
 * @returns A valid TransactionType
 */
export function validateTransactionType(type: string): TransactionType {
	return isValidTransactionType(type) ? type : TransactionType.DEPOSIT;
}
