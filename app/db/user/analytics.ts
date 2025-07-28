import { INVALID_ID_ERROR } from '~/constants/constants';
import { isCUID } from '~/lib/checkIsCUID.server';
import { prisma } from '~/lib/prisma.server';

export async function getAccountSummary(userId: string) {
	if (!isCUID(userId)) return INVALID_ID_ERROR;
	const result = await prisma.userInfo.findUnique({
		where: { userId },
		select: { moneyAdded: true },
	});
	return result?.moneyAdded ?? 0;
}

export function getHostTransactions(userId: string) {
	if (!isCUID(userId)) return INVALID_ID_ERROR;
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
