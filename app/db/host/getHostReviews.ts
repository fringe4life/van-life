import { prisma } from '~/lib/prisma.server';
// import prisma from "~/lib/prisma";
export async function getHostReviews(userId: string) {
	return prisma.review.findMany({
		where: {
			userId,
		},
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
