import { type } from 'arktype';
import { MAX_ADD } from '~/constants/constants';
import { VanState, VanType } from '~/generated/prisma/enums';

const vanStateSchema = type.or(
	...Object.values(VanState).map((v) => type(`"${v}"`)),
	type('null')
);
const vanTypeSchema = type.or(
	...Object.values(VanType).map((v) => type(`"${v}"`))
);

/**
 * Schema for adding a new van.
 * - Validates name, description, type, imageUrl, price, and optional state.
 */
export const addVanSchema = type({
	name: 'string <= 60',
	description: 'string <= 1024',
	type: type('string.trim |> string.upper').to(vanTypeSchema),
	imageUrl: type('string.url').and(/unsplash.*[?&]w=/),
	price: `string.numeric.parse |> 0 < number <= ${MAX_ADD}`,
	'discount?': type('string')
		.pipe((s: string) => (s === '' ? 0 : Number(s)))
		.to('0 <= number <= 50'),
	'state?': vanStateSchema,
});
