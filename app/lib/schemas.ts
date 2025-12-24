import { isCuid } from '@paralleldrive/cuid2';
import { scope, type } from 'arktype';
import { MAX_ADD } from '~/constants/constants';
import { TransactionType, VanState, VanType } from '~/generated/prisma/enums';

/**
 * Schema for validating user passwords.
 * - Must be a string with at least 10 characters.
 */
const passwordSchema = type('string >= 10').describe(
	'Password has to be a minimum of 10 characters'
);

/**
 * Schema for user login form.
 * - Requires a valid email and password.
 */
export const loginSchema = type({
	email: 'string.email',
	password: passwordSchema,
});

/**
 * TypeScript type inferred from loginSchema.
 */
export type LoginSchemaType = typeof loginSchema.infer;

/**
 * Schema for user sign-up form.
 * - Extends loginSchema with confirmPassword and name fields.
 * - Ensures password and confirmPassword match.
 */
export const signUpScheme = type({
	email: 'string.email',
	password: passwordSchema,
	confirmPassword: passwordSchema,
	name: '2 <= string <= 124',
}).narrow((data, ctx) => {
	if (data.password !== data.confirmPassword) {
		return ctx.reject({
			expected: 'identical to password',
			actual: '',
			path: ['confirmPassword'],
		});
	}
	return true;
});

/**
 * Schema for validating van states.
 */
export const vanStateSchema = type.or(
	...Object.values(VanState).map((v) => type(`"${v}"`)),
	type('null')
);
export const vanTypeSchema = type.or(
	...Object.values(VanType).map((v) => type(`"${v}"`))
);
export const transactionTypeSchema = type.or(
	...Object.values(TransactionType).map((v) => type(`"${v}"`))
);

/**
 * Schema for adding a new van.
 * - Validates name, description, type, imageUrl, price, and optional state.
 */
export const addVanSchema = type({
	name: 'string <= 60',
	description: 'string <= 1024',
	type: vanTypeSchema,
	imageUrl: 'string.url',
	price: 'number > 0',
	'discount?': '0 <= number <= 50',
	'state?': vanStateSchema,
}).narrow((data, ctx) => {
	if (!data.imageUrl.includes('unsplash')) {
		return ctx.reject({
			expected: 'image URL from Unsplash',
			actual: data.imageUrl,
			path: ['imageUrl'],
		});
	}
	if (!data.imageUrl.includes('w=')) {
		return ctx.reject({
			expected: 'image URL with width parameter',
			actual: data.imageUrl,
			path: ['imageUrl'],
		});
	}
	if (data.price > MAX_ADD) {
		return ctx.reject({
			expected: `price <= ${MAX_ADD}`,
			actual: String(data.price),
			path: ['price'],
		});
	}
	return true;
});

/**
 * Regex for validating CUID v1 format (used by Prisma's `@default(cuid())`).
 * Format: 'c' + 24 lowercase alphanumeric characters = 25 chars total
 *
 * Our configured CUID v2 (from `createId`) also generates 25-character IDs,
 * validated by the `isCuid()` function.
 */
const cuid1Regex = /^c[0-9a-z]{24}$/;

const isCUID = scope({
	isCuid: type('string').narrow((s, ctx) => {
		if (isCuid(s) || cuid1Regex.test(s)) {
			return true;
		}
		return ctx.mustBe('a valid CUID');
	}),
});

/**
 * Schema for validating CUID v1 or CUID v2 identifiers.
 * Accepts both Prisma's `@default(cuid())` format and our configured 25-char CUID v2.
 */
export const cuidSchema = isCUID.type('isCuid');

/**
 * Schema for money operations (withdraw, deposit) and amount.
 * Amount calculation is adjusted based on transaction type.
 */
export const moneySchema = type({
	type: transactionTypeSchema,
	amount: 'string.numeric.parse',
});

/**
 * Schema for validating URL slugs.
 * - Must be lowercase alphanumeric with hyphens
 * - Must be 1-70 characters
 * - Cannot start or end with hyphen
 */
export const slugSchema = type('/^[a-z0-9](?:[a-z0-9-]{0,68}[a-z0-9])?$/');

/**
 * Schema for renting a van (vanSlug, hostId, renterId).
 */
export const rentVanSchema = type({
	vanSlug: slugSchema,
	hostId: cuidSchema,
	renterId: cuidSchema,
});
