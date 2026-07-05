/** biome-ignore-all lint/style/useNamingConvention: prisma style */
import { prisma } from '~/lib/prisma.server';
import type { UUIDv7 } from '~/types/ids.server';

export async function getAverageReviewRating(userId: UUIDv7) {
	const avg = await prisma.review.aggregate({
		_avg: {
			rating: true,
		},
		orderBy: { createdAt: 'desc' },
		where: {
			rent: {
				hostId: userId,
			},
		},
	});
	return avg._avg.rating ?? 0;
}
