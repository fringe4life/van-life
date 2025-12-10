import { data, href } from 'react-router';
import GenericComponent from '~/components/generic-component';
import PendingUi from '~/components/pending-ui';
import Sortable from '~/components/sortable';
import { validateCUIDS } from '~/dal/validate-cuids';
import LazyBarChart from '~/features/host/components/bar-chart/lazy-bar-chart';
import Income from '~/features/host/components/income';
import { getUserTransactions } from '~/features/host/queries/user/analytics';
import { authContext } from '~/features/middleware/contexts/auth';
import { authMiddleware } from '~/features/middleware/functions/auth-middleware';
import Pagination from '~/features/pagination/components/pagination';
import { DEFAULT_LIMIT } from '~/features/pagination/pagination-constants';
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

	// Parse search parameters for sorting
	const { sort } = loadHostSearchParams(request);

	const result = await tryCatch(() =>
		validateCUIDS(getUserTransactions, [0])(user.id, sort)
	);

	return data(
		{
			userTransactions: result.data,
		},
		{
			headers: {
				'Cache-Control': 'max-age=259200',
			},
		}
	);
}

export default function Transfers({ loaderData }: Route.ComponentProps) {
	const { userTransactions } = loaderData;

	// Calculate total amount and elapsed time client-side
	const sumAmount = Array.isArray(userTransactions)
		? userTransactions.reduce(
				(total, transaction) =>
					transaction.type === TransactionType.DEPOSIT
						? total + transaction.amount
						: -transaction.amount,
				0
			)
		: 0;

	const elapsedTime = Array.isArray(userTransactions)
		? getElapsedTime(
				userTransactions.map((t) => ({
					rentedAt: t.createdAt,
					amount: t.amount,
				}))
			)
		: { elapsedDays: 0, description: 'No data' };

	const filteredTransactions = Array.isArray(userTransactions)
		? userTransactions.filter((transaction) => transaction.amount > 0)
		: [];

	const mappedData = filteredTransactions.map((transaction) => ({
		name: transaction.createdAt.toDateString(),
		amount: Math.round(transaction.amount),
	}));

	const limit = DEFAULT_LIMIT;

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

			<p>
				Last{' '}
				<span className="font-bold text-neutral-600 underline">
					{elapsedTime.elapsedDays} days
				</span>
			</p>
			<p className="mt-8 mb-13 font-extrabold text-3xl sm:text-4xl md:text-5xl">
				{displayPrice(sumAmount)}
			</p>
			<LazyBarChart mappedData={mappedData} />
			<Sortable
				itemCount={filteredTransactions.length}
				title="Transaction History"
			/>

			<GenericComponent
				as="div"
				Component={Income}
				className="grid-max mt-6"
				emptyStateMessage="Make some transactions and they will appear here."
				items={filteredTransactions}
				renderProps={(item) => ({
					...item,
					// Map transaction data to match Income component expectations
					amount:
						item.type === TransactionType.DEPOSIT ? item.amount : -item.amount,
					rentedAt: item.createdAt,
				})}
			/>
			<Pagination
				cursor={undefined}
				hasNextPage={false}
				hasPreviousPage={false}
				items={filteredTransactions}
				limit={limit}
				pathname={href('/host/transfers')}
			/>
		</PendingUi>
	);
}
