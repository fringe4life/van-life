import {
	getHostTransactionsChartData,
	getHostTransactionsPaginated,
} from '~/features/host/dal/transaction.server';
import type { Direction, SortOption } from '~/features/pagination/types';
import { toPagination } from '~/features/pagination/utils/to-pagination.server';
import type { UUIDv7 } from '~/types/ids.server';
import { tryCatch } from '~/utils/try-catch.server';

export interface HostPaginatedPageParams {
	cursor: UUIDv7 | undefined;
	direction: Direction;
	limit: number;
	sort: SortOption;
}

export async function loadIncomePage(
	userId: UUIDv7,
	{ cursor, limit, direction, sort }: HostPaginatedPageParams
) {
	const [{ data: chartData }, { data: paginatedTransactions }] =
		await Promise.all([
			tryCatch(() => getHostTransactionsChartData(userId)),
			tryCatch(() =>
				getHostTransactionsPaginated({
					userId,
					cursor,
					limit,
					direction,
					sort,
				})
			),
		]);

	const pagination = toPagination({
		items: paginatedTransactions,
		limit,
		cursor,
		direction,
	});

	return {
		chartData,
		...pagination,
	};
}
