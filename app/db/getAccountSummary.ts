import { INVALID_ID_ERROR } from '~/constants/constants';
import { isCUID } from '~/lib/checkIsCUID.server';
import { prisma } from '~/lib/prisma.server';

export async function getAccountSummary(userId: string) {
	if (!isCUID(userId)) {
		throw new Error(INVALID_ID_ERROR);
	}

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
		throw new Error('Unable to retrieve account summary');
	}

	return (sum._sum.amount ?? 0) + (moneyAdded.moneyAdded ?? 0);
}
