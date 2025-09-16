import { INVALID_ID_ERROR } from '~/constants/constants';
import { getCursorPaginationInformation } from '~/features/pagination/utils/get-cursor-pagination-information.server';
import type { Prisma } from '~/generated/prisma/client';
import {
	COMMON_SORT_CONFIGS,
	createGenericOrderBy,
} from '~/lib/generic-sorting.server';
import { prisma } from '~/lib/prisma.server';
import type { Direction, SortOption } from '~/types/types';
import { isCUID } from '~/utils/check-is-cuid.server';

// biome-ignore lint/suspicious/useAwait: Prisma queries are async and need await
export async function getHostReviews(userId: string) {
	if (!isCUID(userId)) {
		return INVALID_ID_ERROR;
	}
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

type GetHostReviewsPaginatedParams = {
	userId: string;
	cursor: string | undefined;
	limit: number;
	direction?: Direction;
	sort?: SortOption;
};

export function getHostReviewsPaginated({
	userId,
	cursor,
	limit,
	direction = 'forward',
	sort = 'newest',
}: GetHostReviewsPaginatedParams) {
	if (!isCUID(userId)) {
		return INVALID_ID_ERROR;
	}

	const { actualCursor, takeAmount } = getCursorPaginationInformation(
		cursor,
		limit,
		direction
	);

	// For rating-based sorting, we need to use a different cursor approach
	const isRatingSort = sort === 'highest' || sort === 'lowest';

	if (isRatingSort) {
		const orderByClause = getOrderBy(sort);

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
			take: takeAmount,
			...(actualCursor && {
				cursor: { id: actualCursor },
				skip: 1,
			}),
		};

		return prisma.review.findMany(query);
	}

	const orderByClause = getOrderBy(sort);

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
		cursor: actualCursor ? { id: actualCursor } : undefined,
		skip: actualCursor ? 1 : 0, // Skip the cursor record itself
		take: takeAmount,
	};

	return prisma.review.findMany(query);
}

export function getHostReviewsByRating(userId: string) {
	if (!isCUID(userId)) {
		return INVALID_ID_ERROR;
	}
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
	if (!isCUID(userId)) {
		return INVALID_ID_ERROR;
	}
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
	if (!isCUID(userId)) {
		return INVALID_ID_ERROR;
	}
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
