import { data, href } from 'react-router';
import GenericComponent from '~/components/generic-component';
import PendingUi from '~/components/pending-ui';
import Sortable from '~/components/sortable';
import { validateCUIDS } from '~/dal/validate-cuids';
import LazyBarChart from '~/features/host/components/bar-chart/lazy-bar-chart';
import Income from '~/features/host/components/income';
import { getHostTransactions } from '~/features/host/queries/user/analytics';
import { authContext } from '~/features/middleware/contexts/auth';
import { authMiddleware } from '~/features/middleware/functions/auth-middleware';
import Pagination from '~/features/pagination/components/pagination';
import { DEFAULT_LIMIT } from '~/features/pagination/pagination-constants';
import VanHeader from '~/features/vans/components/van-header';
import { displayPrice } from '~/features/vans/utils/display-price';
import { loadHostSearchParams } from '~/lib/search-params.server';
import type { QueryType } from '~/types/types.server';
import { calculateTotalIncome, getElapsedTime } from '~/utils/get-elapsed-time';
import { tryCatch } from '~/utils/try-catch.server';
import type { Route } from './+types/income';

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export async function loader({ request, context }: Route.LoaderArgs) {
	const session = context.get(authContext);

	// Parse search parameters for sorting
	const { sort } = loadHostSearchParams(request);

	const result = await tryCatch(() =>
		validateCUIDS(getHostTransactions, [0] as const)(session.user.id, sort)
	);

	return data(
		{
			hostIncomes: result.data as QueryType<typeof getHostTransactions>,
		},
		{
			headers: {
				'Cache-Control': 'max-age=259200',
			},
		}
	);
}

export default function Host({ loaderData }: Route.ComponentProps) {
	const { hostIncomes } = loaderData;

	// Calculate income and elapsed time client-side
	const sumIncome = Array.isArray(hostIncomes)
		? calculateTotalIncome(hostIncomes)
		: 0;
	const elapsedTime = Array.isArray(hostIncomes)
		? getElapsedTime(hostIncomes)
		: { elapsedDays: 0, description: 'No data' };

	const filteredHostIncomes = Array.isArray(hostIncomes)
		? hostIncomes.filter((income) => income.amount > 0)
		: [];
	const mappedData = filteredHostIncomes.map((income) => ({
		name: income.createdAt.toDateString(),
		amount: Math.round(income.amount),
	}));

	const limit = DEFAULT_LIMIT;

	return (
		<PendingUi
			as="section"
			className="grid grid-rows-[min-content_min-content_1fr_min-content] contain-content"
		>
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
			<LazyBarChart mappedData={mappedData} />
			<Sortable
				itemCount={filteredHostIncomes.length}
				title="Income Transactions"
			/>
			<title>Your Income | Van Life</title>
			<meta
				content="View your income from van rentals and track earnings"
				name="description"
			/>

			<GenericComponent
				as="div"
				Component={Income}
				className="grid-max mt-6"
				emptyStateMessage="Rent some vans and your income will appear here."
				items={filteredHostIncomes}
				renderProps={(item) => item}
			/>
			<Pagination
				cursor={undefined}
				hasNextPage={false}
				hasPreviousPage={false}
				items={filteredHostIncomes}
				limit={limit}
				pathname={href('/host/income')}
			/>
		</PendingUi>
	);
}
