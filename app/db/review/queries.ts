import { INVALID_ID_ERROR } from '~/constants/constants';
import { isCUID } from '~/lib/checkIsCUID.server';
import { prisma } from '~/lib/prisma.server';

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
