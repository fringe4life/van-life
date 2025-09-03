import { VanType } from '@prisma/client';
import { z } from 'zod/v4';
import {
	DEFAULT_CURSOR,
	DEFAULT_FILTER,
	DEFAULT_LIMIT,
	MAX_ADD,
	MIN_ADD,
} from '~/constants/constants';

/**
 * Schema for validating user passwords.
 * - Must be a string with at least 10 characters.
 */
const passwordSchema = z
	.string()
	.min(10, { error: 'Password has to be a minimum of 10 characters' });

/**
 * Schema for user login form.
 * - Requires a valid email and password.
 */
export const loginSchema = z.object({
	email: z.email().describe('User email address'),
	password: passwordSchema.describe('User password'),
});

/**
 * TypeScript type inferred from loginSchema.
 */
export type loginSchemaType = z.infer<typeof loginSchema>;

/**
 * Schema for user sign-up form.
 * - Extends loginSchema with confirmPassword and name fields.
 * - Ensures password and confirmPassword match.
 */
export const signUpScheme = loginSchema
	.extend({
		confirmPassword: passwordSchema.describe('Password confirmation'),
		name: z.string().min(2).max(124).describe('User display name'),
	})
	.refine((data) => data.password === data.confirmPassword, {
		error: "Passwords don't match.",
		path: ['confirmPassword'],
	});

/**
 * Zod enum schema for van types, allowing a default filter value.
 */
const vanTypeSchema = z.enum(Object.values(VanType));

/**
 * Schema for adding a new van.
 * - Validates name, description, type, imageUrl, and price fields.
 */
export const addVanSchema = z.object({
	name: z
		.string()
		.max(60, { error: 'Name cannot be longer then 60 characters' })
		.describe('Van name (max 60 chars)'),
	description: z
		.string()
		.max(1024, {
			error: 'Description is too long. Max length is 1024 characters',
		})
		.describe('Van description (max 1024 chars)'),
	type: z
		.string()
		.toUpperCase()
		.pipe(vanTypeSchema)
		.describe('Van type (enum)'),
	imageUrl: z
		.url()
		.includes('unsplash', { error: 'Must be a free unsplash image' })
		.includes('w=')
		.describe('Van image URL (must be Unsplash)'),
	price: z.coerce
		.number()
		.positive()
		.max(32767, {
			error: 'Your van cannot be more expensive then $32,767 dollars',
		})
		.describe('Van price (max $32,767)'),
});

/**
 * Schema for validating CUID or CUID2 strings.
 */
export const cuidSchema = z
	.cuid()
	.or(z.cuid2())
	.describe('CUID or CUID2 string');

/**
 * Schema for pagination parameters (limit).
 */
const paginationSchema = z.coerce.number().positive().optional();

/**
 * Schema for money operations (withdraw, deposit) and amount.
 */
export const moneySchema = z.object({
	type: z.enum(['withdraw', 'deposit']).describe('Money operation type'),
	amount: z.coerce.number().min(MIN_ADD).max(MAX_ADD).describe('Amount'),
});

/**
 * Schema for renting a van (vanId, hostId, renterId as CUIDs).
 */
export const rentVanSchema = z.object({
	vanId: cuidSchema.describe('Van CUID'),
	hostId: cuidSchema.describe('Host CUID'),
	renterId: cuidSchema.describe('Renter CUID'),
});

/**
 * Schema for cursor-based pagination in van listings.
 */
export const cursorPaginationSchema = z.object({
	limit: paginationSchema.default(DEFAULT_LIMIT).describe('Items per page'),
	cursor: z
		.cuid()
		.optional()
		.default(DEFAULT_CURSOR)
		.describe('Pagination cursor'),
	type: z
		.string()
		.toUpperCase()
		.optional()
		.default(DEFAULT_FILTER)
		.transform((val) => (val ? vanTypeSchema.parse(val) : undefined))
		.describe('Van type filter'),
});
