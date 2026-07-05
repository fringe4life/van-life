/** biome-ignore-all lint/style/useNamingConvention: prisma style */

import type { PaginationParams, SortOption } from '~/features/pagination/types';
import { getCursorMetadata } from '~/features/pagination/utils/get-cursor-metadata.server';
import { reverseSortOption } from '~/features/pagination/utils/reverse-sort-order';
import type { Prisma } from '~/generated/prisma/client';
import { TransactionType } from '~/generated/prisma/enums';
import {
	COMMON_SORT_CONFIGS,
	createGenericOrderBy,
} from '~/lib/generic-sorting.server';
import { prisma } from '~/lib/prisma.server';
import type { UUIDv7 } from '~/types/ids.server';

export async function getAccountSummary(userId: UUIDv7) {
	const result = await prisma.transaction.aggregate({
		_sum: {
			amount: true,
		},
		where: { userId },
	});
	return result._sum.amount ?? 0;
}

export async function getTransactionSummary(userId: UUIDv7) {
	const result = await prisma.transaction.aggregate({
		_sum: {
			amount: true,
		},
		orderBy: {
			createdAt: 'desc',
		},
		where: { userId },
	});
	return result._sum.amount ?? 0;
}

export async function getHostTransactions(
	userId: UUIDv7,
	sort: SortOption = 'newest'
) {
	const orderBy = createGenericOrderBy(sort, {
		dateField: 'createdAt',
		valueField: 'amount',
	});

	return await prisma.transaction.findMany({
		orderBy,
		select: {
			amount: true,
			createdAt: true,
			id: true,
			rentId: true,
		},
		where: {
			type: TransactionType.RENTAL_PAYMENT,
			userId,
		},
	});
}

const getTransactionOrderBy = (sort: SortOption) =>
	createGenericOrderBy<Prisma.TransactionOrderByWithRelationInput>(
		sort,
		COMMON_SORT_CONFIGS.transaction
	);

const hostRentalPaymentTransactionWhere = (
	userId: UUIDv7
): Prisma.TransactionWhereInput => ({
	type: TransactionType.RENTAL_PAYMENT,
	userId,
});

const hostTransactionListSelect = {
	amount: true,
	createdAt: true,
	id: true,
	rentId: true,
} satisfies Prisma.TransactionSelect;

const userTransactionListSelect = {
	amount: true,
	createdAt: true,
	id: true,
	type: true,
} satisfies Prisma.TransactionSelect;

export function getHostTransactionsPaginated({
	userId,
	cursor,
	limit,
	direction = 'forward',
	sort = 'newest',
}: PaginationParams) {
	const { actualCursor, skip, take } = getCursorMetadata({
		cursor,
		direction,
		limit,
	});

	const effectiveSort = reverseSortOption(sort, direction);
	const orderByClause = getTransactionOrderBy(effectiveSort);

	const query = {
		cursor: actualCursor,
		orderBy: orderByClause,
		select: hostTransactionListSelect,
		skip,
		take,
		where: hostRentalPaymentTransactionWhere(userId),
	} satisfies Prisma.TransactionFindManyArgs;

	return prisma.transaction.findMany(query);
}

export function getUserTransactionsPaginated({
	userId,
	cursor,
	limit,
	direction = 'forward',
	sort = 'newest',
}: PaginationParams) {
	const { actualCursor, skip, take } = getCursorMetadata({
		cursor,
		direction,
		limit,
	});

	const effectiveSort = reverseSortOption(sort, direction);
	const orderByClause = getTransactionOrderBy(effectiveSort);

	const query = {
		cursor: actualCursor,
		orderBy: orderByClause,
		select: userTransactionListSelect,
		skip,
		take,
		where: { userId },
	} satisfies Prisma.TransactionFindManyArgs;

	return prisma.transaction.findMany(query);
}

export function getUserTransactionsChartData(userId: UUIDv7) {
	return prisma.transaction.findMany({
		select: {
			amount: true,
			createdAt: true,
			type: true,
		},
		where: {
			userId,
		},
	});
}

export function getHostTransactionsChartData(userId: UUIDv7) {
	return prisma.transaction.findMany({
		select: {
			amount: true,
			createdAt: true,
		},
		where: {
			type: TransactionType.RENTAL_PAYMENT,
			userId,
		},
	});
}
