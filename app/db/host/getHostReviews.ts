import { isCUID } from '~/lib/checkIsCUID';
import { prisma } from '~/lib/prisma.server';
// import prisma from "~/lib/prisma";
export async function getHostReviews(userId: string) {
	if (!isCUID(userId)) return 'Something went wrong, please try again later';
	return prisma.review.findMany({
		where: {
			userId,
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
