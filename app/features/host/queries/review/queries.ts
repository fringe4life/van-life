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

// biome-ignore lint/suspicious/useAwait: Prisma queries are async and need await
export async function getHostReviews(userId: string) {
	return prisma.review.findMany({
		where: {
			rent: {
				hostId: userId,
			},
		},
		include: {
			user: {
				select: {
					user: {
						select: {
							name: true,
						},
					},
				},
			},
		},
		orderBy: { createdAt: 'desc' },
	});
}

// Use generic sorting utility for reviews
const getOrderBy = (sort: SortOption) =>
	createGenericOrderBy<Prisma.ReviewOrderByWithRelationInput>(
		sort,
		COMMON_SORT_CONFIGS.review
	);

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

	// For backward pagination, reverse the sort order
	// The results will be reversed back in hasPagination utility
	const effectiveSort = reverseSortOption(sort, direction);

	// For rating-based sorting, we need to use a different cursor approach
	const isRatingSort =
		effectiveSort === 'highest' || effectiveSort === 'lowest';

	if (isRatingSort) {
		const orderByClause = getOrderBy(effectiveSort);

		// For rating sorts, we need to handle cursor differently
		// We'll use a combination of rating and id for cursor pagination
		const query = {
			where: {
				rent: {
					hostId: userId,
				},
			},
			include: {
				user: {
					select: {
						user: {
							select: {
								name: true,
							},
						},
					},
				},
			},
			orderBy: orderByClause,
			take,
			cursor: actualCursor,
			skip,
		};

		return prisma.review.findMany(query);
	}

	const orderByClause = getOrderBy(effectiveSort);

	// For date-based sorting, use standard cursor pagination
	const query = {
		where: {
			rent: {
				hostId: userId,
			},
		},
		include: {
			user: {
				select: {
					user: {
						select: {
							name: true,
						},
					},
				},
			},
		},
		orderBy: orderByClause,
		cursor: actualCursor,
		skip, // Skip the cursor record itself
		take,
	};

	return prisma.review.findMany(query);
}

export function getHostReviewsByRating(userId: string) {
	return prisma.review.groupBy({
		where: {
			rent: {
				hostId: userId,
			},
		},
		by: ['rating'],
		_count: { _all: true },
	});
}

export function getHostReviewsChartData(userId: string) {
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

export async function getAverageReviewRating(userId: string) {
	const avg = await prisma.review.aggregate({
		_avg: {
			rating: true,
		},
		where: {
			rent: {
				hostId: userId,
			},
		},
		orderBy: { createdAt: 'desc' },
	});
	return avg._avg.rating ?? 0;
}
