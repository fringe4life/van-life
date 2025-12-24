import { data } from 'react-router';
import GenericComponent from '~/components/generic-component';
import PendingUi from '~/components/pending-ui';
import Sortable from '~/components/sortable';
import { validateCUIDS } from '~/dal/validate-cuids';
import LazyBarChart from '~/features/host/components/bar-chart/lazy-bar-chart';
import Income from '~/features/host/components/income';
import {
	getUserTransactionsChartData,
	getUserTransactionsPaginated,
} from '~/features/host/queries/user/analytics';
import { authContext } from '~/features/middleware/contexts/auth';
import { authMiddleware } from '~/features/middleware/functions/auth-middleware';
import Pagination from '~/features/pagination/components/pagination';
import { toPagination } from '~/features/pagination/utils/to-pagination.server';
import VanHeader from '~/features/vans/components/van-header';
import { displayPrice } from '~/features/vans/utils/display-price';
import { TransactionType } from '~/generated/prisma/enums';
import { loadHostSearchParams } from '~/lib/search-params.server';
import { getElapsedTime } from '~/utils/get-elapsed-time';
import { tryCatch } from '~/utils/try-catch.server';
import type { Route } from './+types/transfers';

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export async function loader({ request, context }: Route.LoaderArgs) {
	const user = context.get(authContext);

	// Parse search parameters for pagination and sorting
	const { cursor, limit, direction, sort } = loadHostSearchParams(request);

	// Load chart data and paginated transactions
	const [{ data: chartData }, { data: paginatedTransactions }] =
		await Promise.all([
			tryCatch(() => validateCUIDS(getUserTransactionsChartData, [0])(user.id)),
			tryCatch(() => {
				const getWithUserId = (userId: string) =>
					getUserTransactionsPaginated({
						userId,
						cursor,
						limit,
						direction,
						sort,
					});
				return validateCUIDS(getWithUserId, [0])(user.id);
			}),
		]);

	// Process pagination logic
	const pagination = toPagination(
		paginatedTransactions,
		limit,
		cursor,
		direction
	);

	return data(
		{
			chartData,
			...pagination,
		},
		{
			headers: {
				'Cache-Control': 'max-age=259200',
			},
		}
	);
}

export default function Transfers({ loaderData }: Route.ComponentProps) {
	const {
		chartData,
		items: paginatedTransactions,
		hasNextPage,
		hasPreviousPage,
	} = loaderData;

	// Calculate total amount and elapsed time from chart data (all transactions)
	const sumAmount =
		chartData?.reduce(
			(total, transaction) =>
				transaction.type === TransactionType.DEPOSIT
					? total + transaction.amount
					: -transaction.amount,
			0
		) ?? 0;

	const elapsedTime = getElapsedTime(
		chartData?.map((t) => ({
			rentedAt: t.createdAt,
			amount: t.amount,
		}))
	);

	const mappedData = chartData?.map((transaction) => ({
		name: transaction.createdAt.toDateString(),
		amount: Math.round(transaction.amount),
	}));

	return (
		<PendingUi
			as="section"
			className="grid grid-rows-[min-content_min-content_min-content_var(--chart-height)_min-content_1fr_min-content] contain-content"
		>
			<title>Your Transfers | Van Life</title>
			<meta
				content="View your transaction history for deposits and withdrawals"
				name="description"
			/>
			<VanHeader>Transfers</VanHeader>

			<p className="mt-6">
				Last{' '}
				<span className="font-bold text-neutral-600 underline">
					{elapsedTime.elapsedDays} days
				</span>
			</p>
			<p className="mt-8 mb-13 font-extrabold text-3xl sm:text-4xl md:text-5xl">
				{displayPrice(sumAmount)}
			</p>
			<LazyBarChart
				data={mappedData}
				emptyStateMessage="No transfers Yet"
				errorStateMessage="Something went wrong"
			/>
			<Sortable itemCount={chartData?.length} title="Transaction History" />

			<GenericComponent
				as="div"
				Component={Income}
				className="grid-max mt-6"
				emptyStateMessage="Make some transactions and they will appear here."
				errorStateMessage="Something went wrong"
				items={paginatedTransactions}
				renderKey={(item) => item.id}
				renderProps={(item) => ({
					...item,
					// Map transaction data to match Income component expectations
					amount:
						item.type === TransactionType.DEPOSIT ? item.amount : -item.amount,
					rentedAt: item.createdAt,
				})}
			/>
			<Pagination
				hasNextPage={hasNextPage}
				hasPreviousPage={hasPreviousPage}
				items={paginatedTransactions}
			/>
		</PendingUi>
	);
}
