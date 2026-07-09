// ============================================================================
// PAGINATION VALIDATORS
// ============================================================================

import {
  DEFAULT_LIMIT,
  LIMITS,
} from "~/features/pagination/pagination-constants";

/**
 * Type guard to check if a number is a valid limit value
 * @param value - The value to check
 * @returns True if the value is in the LIMITS array, false otherwise
 */
function isValidLimit(value: number): value is (typeof LIMITS)[number] {
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
