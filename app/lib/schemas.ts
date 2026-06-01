import { type } from 'arktype';
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
const vanStateSchema = type.or(
	...Object.values(VanState).map((v) => type(`"${v}"`)),
	type('null')
);
const vanTypeSchema = type.or(
	...Object.values(VanType).map((v) => type(`"${v}"`))
);
const transactionTypeSchema = type.or(
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

/** Schema for validating RFC 9562 UUID version 7 identifiers. */
export const uuidv7Schema = type('string.uuid.v7').describe(
	'A valid UUID v7 string'
);

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
const slugSchema = type('/^[a-z0-9](?:[a-z0-9-]{0,68}[a-z0-9])?$/');

/**
 * Schema for renting a van (vanSlug, hostId, renterId).
 */
export const rentVanSchema = type({
	vanSlug: slugSchema,
	hostId: uuidv7Schema,
	renterId: uuidv7Schema,
});
