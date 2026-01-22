import { getCursorMetadata } from '~/features/pagination/utils/get-cursor-metadata.server';
import type { Prisma } from '~/generated/prisma/client';
import { VanState } from '~/generated/prisma/enums';
import { prisma } from '~/lib/prisma.server';
import type { GetVansProps, TypeFilter } from '../types';

const WHITESPACE_REGEX = /\s+/;

/**
 * Formats a search string for PostgreSQL full-text search.
 * Splits the input by whitespace and joins with OR operator (|).
 * Example: "luxury van" -> "luxury | van"
 */
function formatFullTextSearchQuery(search: string): string {
	return search
		.trim()
		.split(WHITESPACE_REGEX)
		.filter((word) => word.length > 0)
		.join(' | ');
}

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
	const {
		actualCursor,
		orderBy: orderByMetadata,
		...rest
	} = getCursorMetadata({
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

	const formattedSearch = search?.trim()
		? formatFullTextSearchQuery(search)
		: undefined;

	// When using _relevance, orderBy must be an array
	// Otherwise, it can be an object
	const orderBy:
		| Prisma.VanOrderByWithRelationInput
		| Prisma.VanOrderByWithRelationInput[] = formattedSearch
		? [
				{
					// biome-ignore lint/style/useNamingConvention: prisma naming convention
					_relevance: {
						fields: ['name', 'description'],
						search: formattedSearch,
						sort: 'asc',
					},
				},
				orderByMetadata,
			]
		: orderByMetadata;

	return prisma.van.findMany({
		where: {
			...(typeCondition && typeCondition),
			...(formattedSearch && {
				OR: [
					{ name: { search: formattedSearch } },
					{ description: { search: formattedSearch } },
				],
			}),
			...(excludeInRepair && { state: { not: VanState.IN_REPAIR } }),
			...(onlyOnSale && { state: VanState.ON_SALE }),
		},
		orderBy,
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
