import { isCUID } from '~/lib/checkIsCUID.server';
import { prisma } from '~/lib/prisma.server';
// import prisma from '~/lib/prisma';
export async function getHostTransactions(userId: string) {
	if (!isCUID(userId)) return 'Something went wrong, please try again later';
	return prisma.rent.findMany({
		where: {
			hostId: userId,
			amount: {
				gt: 0,
			},
		},
		select: {
			amount: true,
			rentedAt: true,
			id: true,
		},
	});
}
