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
		where: { userId },
		_sum: {
			amount: true,
		},
	});
	return result._sum.amount ?? 0;
}

export async function getTransactionSummary(userId: UUIDv7) {
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
	userId: UUIDv7,
	sort: SortOption = 'newest'
) {
	const orderBy = createGenericOrderBy(sort, {
		dateField: 'createdAt',
		valueField: 'amount',
	});

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

const getTransactionOrderBy = (sort: SortOption) =>
	createGenericOrderBy<Prisma.TransactionOrderByWithRelationInput>(
		sort,
		COMMON_SORT_CONFIGS.transaction
	);

const hostRentalPaymentTransactionWhere = (
	userId: UUIDv7
): Prisma.TransactionWhereInput => ({
	userId,
	type: TransactionType.RENTAL_PAYMENT,
});

const hostTransactionListSelect = {
	amount: true,
	createdAt: true,
	id: true,
	rentId: true,
} satisfies Prisma.TransactionSelect;

const userTransactionListSelect = {
	id: true,
	amount: true,
	type: true,
	createdAt: true,
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
		limit,
		direction,
	});

	const effectiveSort = reverseSortOption(sort, direction);
	const orderByClause = getTransactionOrderBy(effectiveSort);

	const query = {
		where: hostRentalPaymentTransactionWhere(userId),
		select: hostTransactionListSelect,
		orderBy: orderByClause,
		cursor: actualCursor,
		skip,
		take,
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
		limit,
		direction,
	});

	const effectiveSort = reverseSortOption(sort, direction);
	const orderByClause = getTransactionOrderBy(effectiveSort);

	const query = {
		where: { userId },
		select: userTransactionListSelect,
		orderBy: orderByClause,
		cursor: actualCursor,
		skip,
		take,
	} satisfies Prisma.TransactionFindManyArgs;

	return prisma.transaction.findMany(query);
}

export function getUserTransactionsChartData(userId: UUIDv7) {
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

export function getHostTransactionsChartData(userId: UUIDv7) {
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
