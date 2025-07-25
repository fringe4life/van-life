import { prisma } from '~/lib/prisma.server';
// import prisma from '~/lib/prisma';
export async function getAverageReviewRating(userId: string) {
	return prisma.review.groupBy({
		where: {
			userId,
		},
		by: ['rating'],
		_count: { _all: true },
	});
}
