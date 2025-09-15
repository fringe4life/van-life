import { INVALID_ID_ERROR } from '~/constants/constants';
import { prisma } from '~/lib/prisma.server';
import { isCUID } from '~/utils/checkIsCUID.server';

export async function getAverageReviewRating(userId: string) {
	if (!isCUID(userId)) {
		throw new Error(INVALID_ID_ERROR);
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
