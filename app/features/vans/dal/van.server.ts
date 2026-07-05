import { getCursorMetadata } from '~/features/pagination/utils/get-cursor-metadata.server';
import type { GetVansProps } from '~/features/vans/types';
import type { Prisma } from '~/generated/prisma/client';
import type { VanType as VanTypeEnum } from '~/generated/prisma/enums';
import { VanState, VanType } from '~/generated/prisma/enums';
import type { VanModel } from '~/generated/prisma/models';
import { prisma } from '~/lib/prisma.server';
import type { Prettify } from '~/types';

const WHITESPACE_REGEX = /\s+/;
const VAN_TYPE_VALUES = new Set<string>(Object.values(VanType));

function parseVanTypeStrings(types: string[]): VanTypeEnum[] {
	return types
		.map((t) => t.toUpperCase())
		.filter((t): t is VanTypeEnum => VAN_TYPE_VALUES.has(t));
}

function buildVanTypeFilter(
	types: string[] | undefined,
	typeFilter: VanTypeEnum | undefined
): Prettify<Pick<Prisma.VanWhereInput, 'type'>> | undefined {
	if (types && types.length > 0) {
		const vanTypes = parseVanTypeStrings(types);
		if (vanTypes.length === 0) {
			return;
		}
		return { type: { in: vanTypes } };
	}
	if (typeFilter) {
		return { type: typeFilter };
	}
}

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
		direction,
		limit,
	});

	const typeCondition = buildVanTypeFilter(types, typeFilter);

	const formattedSearch = search?.trim()
		? formatFullTextSearchQuery(search)
		: undefined;

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
		cursor: actualCursor,
		orderBy,
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
		...rest,
	});
}

export function getVanBySlug(slug: string) {
	return prisma.van.findUnique({
		where: {
			slug,
		},
	});
}

export function createVan(
	newVan: Prettify<Omit<VanModel, 'id' | 'createdAt' | 'isRented'>>
) {
	return prisma.van.create({
		data: { ...newVan, createdAt: new Date(), isRented: false },
	});
}
