import { isCUID } from '~/lib/checkIsCUID.server';
import { prisma } from '~/lib/prisma.server';
// import prisma from '~/lib/prisma';
export async function getAccountSummary(userId: string) {
	if (!isCUID(userId)) return 'Something went wrong, please try again later';

	const results = await Promise.allSettled([
		prisma.rent.aggregate({
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
		}),
		prisma.userInfo.findUnique({
			where: {
				userId,
			},
			select: {
				moneyAdded: true,
			},
		}),
	]);

	const sum = results[0].status === 'fulfilled' ? results[0].value : null;
	const moneyAdded =
		results[1].status === 'fulfilled' ? results[1].value : null;

	if (!sum || !moneyAdded) {
		return 'Unable to retrieve account summary';
	}

	return (sum._sum.amount ?? 0) + (moneyAdded.moneyAdded ?? 0);
}
