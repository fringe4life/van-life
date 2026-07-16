import { type UUIDv7, uuidv7Schema } from "~/dal/schemas.server";
import type { Maybe } from "~/types";
import { DomainError, isDomainError } from "~/utils/domain-error.server";
import { validateArkType } from "~/utils/parse-arktype.server";

/**
 * Parse and brand a string as UUIDv7.
 * Throws {@link DomainError} with code `INVALID_ID` on failure.
 */
export function parseUuidV7(value: string, message = "Invalid id"): UUIDv7 {
  const result = validateArkType(uuidv7Schema, value);

  if (!result.success) {
    throw new DomainError("INVALID_ID", message);
  }

  return result.data;
}

/**
 * Parse cursor string when non-empty; undefined for empty/missing/malformed cursors.
 */
export function parseOptionalUuidV7(value: Maybe<string>): UUIDv7 | undefined {
  if (!value || value === "") {
    return;
  }

  try {
    return parseUuidV7(value);
  } catch (error) {
    if (isDomainError(error) && error.code === "INVALID_ID") {
      return;
    }

    throw error;
  }
}
