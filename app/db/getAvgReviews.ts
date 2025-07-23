import { prisma } from '~/lib/prisma.server';
// import prisma from '~/lib/prisma';
export async function getAverageReviewRating(userId: string) {
	const avg = await prisma.review.aggregate({
		_avg: {
			rating: true,
		},
		where: {
			userId,
		},
		orderBy: {
			userId: 'desc',
		},
	});

	return avg._avg.rating ?? 0;
}
