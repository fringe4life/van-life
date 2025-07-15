import { prisma } from '~/lib/prisma';

export async function getAverageReviewRating(userId: string) {
	const avg = await prisma.review.aggregate({
		_avg: {
			rating: true,
		},
		where: {
			userId,
		},
	});

	return avg._avg.rating ?? 0;
}
