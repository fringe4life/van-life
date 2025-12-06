/** biome-ignore-all lint/style/useNamingConvention: prisma style */
import { prisma } from '~/lib/prisma.server';

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
