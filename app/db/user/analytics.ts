import { INVALID_ID_ERROR } from '~/constants/constants';
import { createGenericOrderBy } from '~/lib/genericSorting.server';
import { prisma } from '~/lib/prisma.server';
import type { SortOption } from '~/types/types';
import { isCUID } from '~/utils/checkIsCUID.server';

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

export async function getHostTransactions(
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

	return await prisma.rent.findMany({
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

export async function getUserTransactions(
	userId: string,
	sort: SortOption = 'newest'
) {
	if (!isCUID(userId)) {
		return INVALID_ID_ERROR;
	}

	// Create orderBy clause using generic sorting utility
	const orderBy = createGenericOrderBy(sort, {
		dateField: 'createdAt',
		valueField: 'amount',
	});

	return await prisma.transaction.findMany({
		where: {
			userId,
		},
		select: {
			id: true,
			amount: true,
			type: true,
			createdAt: true,
		},
		orderBy,
	});
}
