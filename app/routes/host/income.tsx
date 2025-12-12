import { data } from 'react-router';
import GenericComponent from '~/components/generic-component';
import PendingUi from '~/components/pending-ui';
import Sortable from '~/components/sortable';
import UnsuccesfulState from '~/components/unsuccesful-state';
import { validateCUIDS } from '~/dal/validate-cuids';
import LazyBarChart from '~/features/host/components/bar-chart/lazy-bar-chart';
import Income from '~/features/host/components/income';
import {
	getHostTransactionsChartData,
	getHostTransactionsPaginated,
} from '~/features/host/queries/user/analytics';
import { authContext } from '~/features/middleware/contexts/auth';
import { authMiddleware } from '~/features/middleware/functions/auth-middleware';
import Pagination from '~/features/pagination/components/pagination';
import { toPagination } from '~/features/pagination/utils/to-pagination.server';
import VanHeader from '~/features/vans/components/van-header';
import { displayPrice } from '~/features/vans/utils/display-price';
import { loadHostSearchParams } from '~/lib/search-params.server';
import { calculateTotalIncome, getElapsedTime } from '~/utils/get-elapsed-time';
import { tryCatch } from '~/utils/try-catch.server';
import type { Route } from './+types/income';
export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export async function loader({ request, context }: Route.LoaderArgs) {
	const user = context.get(authContext);

	// Parse search parameters for pagination and sorting
	const { cursor, limit, direction, sort } = loadHostSearchParams(request);

	// Load chart data and paginated transactions
	const [{ data: chartData }, { data: paginatedTransactions }] =
		await Promise.all([
			tryCatch(() => validateCUIDS(getHostTransactionsChartData, [0])(user.id)),
			tryCatch(() => {
				const getWithUserId = async (userId: string) =>
					getHostTransactionsPaginated({
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

export default function Host({ loaderData }: Route.ComponentProps) {
	const {
		chartData,
		items: paginatedTransactions,
		hasNextPage,
		hasPreviousPage,
	} = loaderData;

	// Calculate income and elapsed time from chart data (all transactions)
	const sumIncome = calculateTotalIncome(chartData);
	const elapsedTime = getElapsedTime(chartData);

	let barChartElement = (
		<UnsuccesfulState isError message="No income data available" />
	);

	if (chartData) {
		const mappedData = chartData.map((income) => ({
			name: income.createdAt.toDateString(),
			amount: Math.round(income.amount),
		}));
		barChartElement = <LazyBarChart mappedData={mappedData} />;
	}

	return (
		<PendingUi
			as="section"
			className="grid grid-rows-[min-content_min-content_min-content_var(--chart-height)_min-content_1fr_min-content] contain-content"
		>
			<title>Your Income | Van Life</title>
			<meta
				content="View your income from van rentals and track earnings"
				name="description"
			/>
			<VanHeader>Income</VanHeader>

			<p>
				Last{' '}
				<span className="font-bold text-neutral-600 underline">
					{elapsedTime.elapsedDays} days
				</span>
			</p>
			<p className="mt-8 mb-13 font-extrabold text-3xl sm:text-4xl md:text-5xl">
				{displayPrice(sumIncome)}
			</p>
			{barChartElement}
			<Sortable itemCount={chartData?.length} title="Income Transactions" />

			<GenericComponent
				as="div"
				Component={Income}
				className="grid-max mt-6"
				emptyStateMessage="Rent some vans and your income will appear here."
				items={paginatedTransactions}
				renderKey={(item) => item.id}
				renderProps={(item) => item}
			/>
			<Pagination
				hasNextPage={hasNextPage}
				hasPreviousPage={hasPreviousPage}
				items={paginatedTransactions}
			/>
		</PendingUi>
	);
}
