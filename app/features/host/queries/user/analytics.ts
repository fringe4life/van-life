/** biome-ignore-all lint/style/useNamingConvention: prisma style */
import { TransactionType } from '~/generated/prisma/enums';
import { createGenericOrderBy } from '~/lib/generic-sorting.server';
import { prisma } from '~/lib/prisma.server';
import type { SortOption } from '~/types/types';

export async function getAccountSummary(userId: string) {
	const result = await prisma.transaction.aggregate({
		where: { userId },
		_sum: {
			amount: true,
		},
	});
	return result._sum.amount ?? 0;
}

export async function getTransactionSummary(userId: string) {
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
