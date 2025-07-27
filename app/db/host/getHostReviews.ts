import { INVALID_ID_ERROR } from '~/constants/constants';
import { isCUID } from '~/lib/checkIsCUID.server';
import { prisma } from '~/lib/prisma.server';
// import prisma from "~/lib/prisma";
export function getHostReviews(userId: string) {
	if (!isCUID(userId)) {
		throw new Error(INVALID_ID_ERROR);
	}
	return prisma.review.findMany({
		where: {
			rent: {
				hostId: userId,
			},
		},
		orderBy: { createdAt: 'desc' },
		include: {
			user: {
				include: {
					user: {
						select: {
							name: true,
						},
					},
				},
			},
		},
	});
}
