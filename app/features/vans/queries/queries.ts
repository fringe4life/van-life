import { getCursorMetadata } from '~/features/pagination/utils/get-cursor-metadata.server';
import { VanState } from '~/generated/prisma/enums';
import { prisma } from '~/lib/prisma.server';
import type { GetVansProps, TypeFilter } from '../types';

export function getVans({
	cursor,
	limit,
	direction,
	typeFilter,
	search,
	types,
	excludeInRepair,
	onlyOnSale,
}: GetVansProps) {
	const { actualCursor, ...rest } = getCursorMetadata({
		cursor,
		limit,
		direction,
	});

	// Prioritize types array over single typeFilter
	// Convert lowercase types to VanType enum values
	let typeCondition:
		| { type: { in: Array<'SIMPLE' | 'LUXURY' | 'RUGGED'> } }
		| { type: 'SIMPLE' | 'LUXURY' | 'RUGGED' }
		| undefined;
	if (types && types.length > 0) {
		typeCondition = {
			type: {
				in: types.map((t) => t.toUpperCase()) as Array<
					'SIMPLE' | 'LUXURY' | 'RUGGED'
				>,
			},
		};
	} else if (typeFilter) {
		typeCondition = { type: typeFilter };
	} else {
		typeCondition = undefined;
	}

	return prisma.van.findMany({
		where: {
			...(typeCondition && typeCondition),
			...(search?.trim() && {
				name: { contains: search, mode: 'insensitive' },
			}),
			...(excludeInRepair && { state: { not: VanState.IN_REPAIR } }),
			...(onlyOnSale && { state: VanState.ON_SALE }),
		},
		// Cursor pagination requires ordering by a unique, sequential field
		cursor: actualCursor,
		...rest,
	});
}

export function getVansCount({ typeFilter }: TypeFilter) {
	return prisma.van.count({
		where: {
			type: typeFilter,
		},
	});
}

export function getVanBySlug(slug: string) {
	return prisma.van.findUnique({
		where: {
			slug,
		},
	});
}
