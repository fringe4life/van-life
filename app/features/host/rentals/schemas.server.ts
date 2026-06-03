import { type } from 'arktype';
import { uuidv7Schema } from '~/dal/schemas.server';

/**
 * Schema for validating URL slugs.
 * - Must be lowercase alphanumeric with hyphens
 * - Must be 1-70 characters
 * - Cannot start or end with hyphen
 */
const slugSchema = type('/^[a-z0-9](?:[a-z0-9-]{0,68}[a-z0-9])?$/');

/**
 * Schema for renting a van (vanSlug, hostId, renterId).
 */
export const rentVanSchema = type({
	vanSlug: slugSchema,
	hostId: uuidv7Schema,
	renterId: uuidv7Schema,
});
