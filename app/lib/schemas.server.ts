import { z } from 'zod/v4';
import { MAX_ADD, MIN_ADD } from '~/constants/constants';
import { TransactionType, VanState, VanType } from '~/generated/prisma/enums';

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
		// biome-ignore lint/style/noMagicNumbers: just a number
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
const vanStateSchema = z.enum(Object.values(VanState));

/**
 * Schema for adding a new van.
 * - Validates name, description, type, imageUrl, price, and optional state.
 */
export const addVanSchema = z.object({
	name: z
		.string()
		.max(60, { error: 'Name cannot be longer then 60 characters' })
		.describe('Van name (max 60 chars)'),
	description: z
		.string()
		// biome-ignore lint/style/noMagicNumbers: just a number
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
		// biome-ignore lint/style/noMagicNumbers: just a number
		.max(32_767, {
			error: 'Your van cannot be more expensive then $32,767 dollars',
		})
		.describe('Van price (max $32,767)'),
	discount: z.coerce
		.number()
		.min(0)
		// biome-ignore lint/style/noMagicNumbers: just a number
		.max(100)
		.optional()
		.transform((v) => v ?? 0)
		.describe('Optional discount percentage (0-100), defaults to 0'),
	state: z
		.string()
		.optional()
		.transform((v) => (v ? v.toUpperCase() : undefined))
		.pipe(vanStateSchema.optional())
		.transform((v) => v ?? 'AVAILABLE')
		.describe('Van state (enum, defaults to AVAILABLE)'),
});

/**
 * Schema for validating CUID or CUID2 strings.
 */
export const cuidSchema = z
	.cuid()
	.or(z.cuid2())
	.describe('CUID or CUID2 string');

/**
 * Schema for money operations (withdraw, deposit) and amount.
 * Amount calculation is adjusted based on transaction type.
 */
export const moneySchema = z
	.object({
		type: z
			.enum(Object.values(TransactionType))
			.describe('Money operation type'),
		amount: z.coerce.number().describe('Amount'),
	})
	.refine(
		(data) => {
			// Different validation rules based on transaction type
			if (data.type === 'WITHDRAW') {
				// For withdrawals, amount should be negative (or we'll make it negative)
				return (
					Math.abs(data.amount) >= MIN_ADD && Math.abs(data.amount) <= MAX_ADD
				);
			}
			// For deposits, amount should be positive
			return data.amount >= MIN_ADD && data.amount <= MAX_ADD;
		},
		{
			message: 'Amount must be within valid range for transaction type',
			path: ['amount'],
		}
	)
	.transform((data) => {
		// Adjust amount based on transaction type
		const adjustedAmount =
			data.type === 'WITHDRAW'
				? -Math.abs(data.amount) // Withdrawals are negative
				: Math.abs(data.amount); // Deposits are positive

		return {
			...data,
			amount: adjustedAmount,
		};
	});

/**
 * Schema for renting a van (vanId, hostId, renterId as CUIDs).
 */
export const rentVanSchema = z.object({
	vanId: cuidSchema.describe('Van CUID'),
	hostId: cuidSchema.describe('Host CUID'),
	renterId: cuidSchema.describe('Renter CUID'),
});
