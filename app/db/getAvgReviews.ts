import { isCUID } from '~/lib/checkIsCUID.server';
import { prisma } from '~/lib/prisma.server';
// import prisma from '~/lib/prisma';
export async function getAverageReviewRating(userId: string) {
	if (!isCUID(userId)) return 'Something went wrong, please try again later';
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
