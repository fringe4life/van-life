// ============================================================================
// PAGINATION VALIDATORS
// ============================================================================

import {
  DEFAULT_LIMIT,
  LIMITS,
} from "~/features/pagination/pagination-constants";
import type { Limits } from "../types";

/**
 * Type guard to check if a number is a valid limit value
 * @param value - The value to check
 * @returns True if the value is in the LIMITS array, false otherwise
 */
function isValidLimit(value: number): value is Limits {
  return LIMITS.includes(value as Limits);
}

/**
 * Validates and returns a valid limit value, defaulting to DEFAULT_LIMIT if invalid
 * @param limit - The limit value to validate
 * @returns A valid limit value from the LIMITS array
 */
export function validateLimit(limit: number): Limits {
  return isValidLimit(limit) ? limit : DEFAULT_LIMIT;
}
