import { INVALID_ID_ERROR } from '~/constants/constants';
import { isCUID } from '~/lib/checkIsCUID.server';
import { createGenericOrderBy } from '~/lib/genericSorting.server';
import { prisma } from '~/lib/prisma.server';
import type { SortOption } from '~/types/types';

export async function getAccountSummary(userId: string) {
	if (!isCUID(userId)) {
		return INVALID_ID_ERROR;
	}
	const result = await prisma.userInfo.findUnique({
		where: { userId },
		select: { moneyAdded: true },
	});
	return result?.moneyAdded ?? 0;
}

export function getHostTransactions(
	userId: string,
	sort: SortOption = 'newest'
) {
	if (!isCUID(userId)) {
		return INVALID_ID_ERROR;
	}

	// Create orderBy clause using generic sorting utility
	const orderBy = createGenericOrderBy(sort, {
		dateField: 'rentedAt',
		valueField: 'amount',
	});

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
		orderBy,
	});
}
