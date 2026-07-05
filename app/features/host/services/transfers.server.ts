import {
	getUserTransactionsChartData,
	getUserTransactionsPaginated,
} from '~/features/host/dal/transaction.server';
import type { HostPaginatedPageParams } from '~/features/host/services/income.server';
import { toPagination } from '~/features/pagination/utils/to-pagination.server';
import type { UUIDv7 } from '~/types/ids.server';
import { tryCatch } from '~/utils/try-catch.server';

export async function loadTransfersPage(
	userId: UUIDv7,
	{ cursor, limit, direction, sort }: HostPaginatedPageParams
) {
	const [{ data: chartData }, { data: paginatedTransactions }] =
		await Promise.all([
			tryCatch(() => getUserTransactionsChartData(userId)),
			tryCatch(() =>
				getUserTransactionsPaginated({
					cursor,
					direction,
					limit,
					sort,
					userId,
				})
			),
		]);

	const pagination = toPagination({
		cursor,
		direction,
		items: paginatedTransactions,
		limit,
	});

	return {
		chartData,
		...pagination,
	};
}
