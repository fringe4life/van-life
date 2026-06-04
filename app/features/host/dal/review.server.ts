/** biome-ignore-all lint/style/useNamingConvention: prisma style */
import type { PaginationParams, SortOption } from '~/features/pagination/types';
import { getCursorMetadata } from '~/features/pagination/utils/get-cursor-metadata.server';
import { reverseSortOption } from '~/features/pagination/utils/reverse-sort-order';
import type { Prisma } from '~/generated/prisma/client';
import {
	COMMON_SORT_CONFIGS,
	createGenericOrderBy,
} from '~/lib/generic-sorting.server';
import { prisma } from '~/lib/prisma.server';
import type { UUIDv7 } from '~/types/ids.server';

const getOrderBy = (sort: SortOption) =>
	createGenericOrderBy<Prisma.ReviewOrderByWithRelationInput>(
		sort,
		COMMON_SORT_CONFIGS.review
	);

const hostReviewListInclude = {
	user: {
		select: {
			name: true,
		},
	},
} satisfies Prisma.ReviewInclude;

function hostReviewListWhere(userId: UUIDv7): Prisma.ReviewWhereInput {
	return {
		rent: {
			hostId: userId,
		},
	};
}

export function getHostReviewsPaginated({
	userId,
	cursor,
	limit,
	direction = 'forward',
	sort = 'newest',
}: PaginationParams) {
	const { actualCursor, skip, take } = getCursorMetadata({
		cursor,
		limit,
		direction,
	});

	const effectiveSort = reverseSortOption(sort, direction);
	const orderByClause = getOrderBy(effectiveSort);

	const query = {
		where: hostReviewListWhere(userId),
		include: hostReviewListInclude,
		orderBy: orderByClause,
		cursor: actualCursor,
		skip,
		take,
	} satisfies Prisma.ReviewFindManyArgs;

	return prisma.review.findMany(query);
}

export function getHostReviewsChartData(userId: UUIDv7) {
	return prisma.review.findMany({
		where: {
			rent: {
				hostId: userId,
			},
		},
		select: {
			rating: true,
		},
		orderBy: { createdAt: 'desc' },
	});
}
