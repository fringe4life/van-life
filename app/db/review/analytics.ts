import { INVALID_ID_ERROR } from '~/constants/constants';
import { isCUID } from '~/lib/checkIsCUID.server';
import { prisma } from '~/lib/prisma.server';
// import prisma from '~/lib/prisma';
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
