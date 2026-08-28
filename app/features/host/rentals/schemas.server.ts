import { maxLength, object, pipe, regex, string } from "valibot";
import { uuidv7Schema } from "~/dal/schemas.server";

/**
 * URL slug: lowercase alphanumeric words joined by single hyphens, max 70 chars.
 */
const slugSchema = pipe(
  string(),
  regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters, numbers, hyphens"),
  maxLength(70)
);

/**
 * Schema for renting a van (vanSlug, renterId).
 * hostId is derived server-side from the van record.
 */
export const rentVanSchema = object({
  renterId: uuidv7Schema,
  vanSlug: slugSchema,
});
