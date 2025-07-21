import { prisma } from '~/lib/prisma';
// import prisma from '~/lib/prisma';
export async function getAccountSummary(userId: string) {
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
