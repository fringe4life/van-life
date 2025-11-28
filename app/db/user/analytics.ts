import { INVALID_ID_ERROR } from '~/constants/constants';
import { TransactionType } from '~/generated/prisma/enums';
import { createGenericOrderBy } from '~/lib/generic-sorting.server';
import { prisma } from '~/lib/prisma.server';
import type { SortOption } from '~/types/types';
import { isCUID } from '~/utils/check-is-cuid.server';

export async function getAccountSummary(userId: string) {
	if (!isCUID(userId)) {
		return INVALID_ID_ERROR;
	}
	const result = await prisma.transaction.aggregate({
		where: { userId },
		_sum: {
			amount: true,
		},
	});
	return result._sum.amount ?? 0;
}

export async function getTransactionSummary(userId: string) {
	if (!isCUID(userId)) {
		return INVALID_ID_ERROR;
	}
	const result = await prisma.transaction.aggregate({
		where: { userId },
		_sum: {
			amount: true,
		},
		orderBy: {
			createdAt: 'desc',
		},
	});
	return result._sum.amount ?? 0;
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
		dateField: 'createdAt',
		valueField: 'amount',
	});

	// Get rental payment transactions for host
	return await prisma.transaction.findMany({
		where: {
			userId,
			type: TransactionType.RENTAL_PAYMENT,
		},
		select: {
			amount: true,
			createdAt: true,
			id: true,
			rentId: true,
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
