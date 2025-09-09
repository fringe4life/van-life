import { INVALID_ID_ERROR } from '~/constants/constants';
import { isCUID } from '~/lib/checkIsCUID.server';
import { getCursorPaginationInformation } from '~/lib/getCursorPaginationInformation.server';
import { prisma } from '~/lib/prisma.server';
import type { Direction } from '~/types/types';

export async function getHostReviews(userId: string) {
	if (!isCUID(userId)) return INVALID_ID_ERROR;
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

export function getHostReviewsPaginated(
	userId: string,
	cursor: string | undefined,
	limit: number,
	direction: Direction = 'forward',
) {
	if (!isCUID(userId)) return INVALID_ID_ERROR;

	const { actualCursor, sortOrder, takeAmount } =
		getCursorPaginationInformation(cursor, limit, direction);

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
		// Cursor pagination requires ordering by a unique, sequential field
		orderBy: { id: sortOrder },
		cursor: actualCursor ? { id: actualCursor } : undefined,
		skip: actualCursor ? 1 : 0, // Skip the cursor record itself
		take: takeAmount,
	});
}

export function getHostReviewsByRating(userId: string) {
	if (!isCUID(userId)) return INVALID_ID_ERROR;
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
	if (!isCUID(userId)) return INVALID_ID_ERROR;
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
	if (!isCUID(userId)) return INVALID_ID_ERROR;
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
