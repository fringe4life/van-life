import { isCUID } from '~/lib/checkIsCUID.server';
import { prisma } from '~/lib/prisma.server';
// import prisma from '~/lib/prisma';
export async function getAccountSummary(userId: string) {
	if (!isCUID(userId)) return 'Something went wrong, please try again later';
	try {
		const sum = await prisma.rent.aggregate({
			_sum: {
				amount: true,
			},
			where: {
				hostId: userId,
				rentedTo: {
					not: null,
				},
			},
			orderBy: {
				hostId: 'desc',
			},
		});
		const moneyAdded = await prisma.userInfo.findUnique({
			where: {
				userId,
			},
			select: {
				moneyAdded: true,
			},
		});
		return (sum._sum.amount ?? 0) + (moneyAdded?.moneyAdded ?? 0);
	} catch (_) {
		return 'Unable to retrieve account summary';
	}
}
