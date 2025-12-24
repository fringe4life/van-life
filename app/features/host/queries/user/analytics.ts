/** biome-ignore-all lint/style/useNamingConvention: prisma style */

import type {
	Direction,
	PaginationParams,
	SortOption,
} from '~/features/pagination/types';
import { getCursorPaginationInformation } from '~/features/pagination/utils/get-cursor-pagination-information.server';
import { reverseSortOption } from '~/features/pagination/utils/reverse-sort-order';
import type { Prisma } from '~/generated/prisma/client';
import { TransactionType } from '~/generated/prisma/enums';
import {
	COMMON_SORT_CONFIGS,
	createGenericOrderBy,
} from '~/lib/generic-sorting.server';
import { prisma } from '~/lib/prisma.server';
import type { Maybe } from '~/types/types';

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

// Use generic sorting utility for transactions
const getTransactionOrderBy = (sort: SortOption) =>
	createGenericOrderBy<Prisma.TransactionOrderByWithRelationInput>(
		sort,
		COMMON_SORT_CONFIGS.transaction
	);

interface GetHostTransactionsPaginatedParams {
	userId: string;
	cursor: Maybe<string>;
	limit: number;
	direction?: Direction;
	sort?: SortOption;
}

export function getHostTransactionsPaginated({
	userId,
	cursor,
	limit,
	direction = 'forward',
	sort = 'newest',
}: GetHostTransactionsPaginatedParams) {
	const { actualCursor, takeAmount } = getCursorPaginationInformation(
		cursor,
		limit,
		direction
	);

	// For backward pagination, reverse the sort order
	// The results will be reversed back in hasPagination utility
	const effectiveSort = reverseSortOption(sort, direction);

	const orderByClause = getTransactionOrderBy(effectiveSort);

	// For date-based sorting, use standard cursor pagination
	const query = {
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
		orderBy: orderByClause,
		cursor: actualCursor ? { id: actualCursor } : undefined,
		skip: actualCursor ? 1 : 0, // Skip the cursor record itself
		take: takeAmount,
	};

	return prisma.transaction.findMany(query);
}

export function getUserTransactionsPaginated({
	userId,
	cursor,
	limit,
	direction = 'forward',
	sort = 'newest',
}: PaginationParams) {
	const { actualCursor, takeAmount } = getCursorPaginationInformation(
		cursor,
		limit,
		direction
	);

	// For backward pagination, reverse the sort order
	// The results will be reversed back in hasPagination utility
	const effectiveSort = reverseSortOption(sort, direction);

	const orderByClause = getTransactionOrderBy(effectiveSort);

	// For date-based sorting, use standard cursor pagination
	const query = {
		where: {
			userId,
		},
		select: {
			id: true,
			amount: true,
			type: true,
			createdAt: true,
		},
		orderBy: orderByClause,
		cursor: actualCursor ? { id: actualCursor } : undefined,
		skip: actualCursor ? 1 : 0, // Skip the cursor record itself
		take: takeAmount,
	};

	return prisma.transaction.findMany(query);
}

export function getUserTransactionsChartData(userId: string) {
	return prisma.transaction.findMany({
		where: {
			userId,
		},
		select: {
			amount: true,
			createdAt: true,
			type: true,
		},
	});
}

export function getHostTransactionsChartData(userId: string) {
	return prisma.transaction.findMany({
		where: {
			userId,
			type: TransactionType.RENTAL_PAYMENT,
		},
		select: {
			amount: true,
			createdAt: true,
		},
	});
}
