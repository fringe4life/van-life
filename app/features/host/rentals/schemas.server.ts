import "~/lib/arktype.config";
import { type } from "arktype";
import { uuidv7Schema } from "~/dal/schemas.server";

/**
 * Schema for validating URL slugs.
 * - Must be lowercase alphanumeric with hyphens
 * - Must be 1-70 characters
 * - Cannot start or end with hyphen
 */
const slugSchema = type("/^[a-z0-9](?:[a-z0-9-]{0,68}[a-z0-9])?$/");

/**
 * Schema for renting a van (vanSlug, renterId).
 * hostId is derived server-side from the van record.
 */
export const rentVanSchema = type({
  renterId: uuidv7Schema,
  vanSlug: slugSchema,
});
