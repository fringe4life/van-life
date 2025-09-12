import { data, href } from 'react-router';
import Sortable from '~/components/common/Sortable';
import Income from '~/components/host/Income';
import LazyBarChart from '~/components/host/LazyBarChart';
import VanPages from '~/components/van/VanPages';
import { getHostTransactions } from '~/db/user/analytics';
import { calculateTotalIncome, getElapsedTime } from '~/lib/getElapsedTime';
import { getSessionOrRedirect } from '~/lib/getSessionOrRedirect.server';
import { loadHostSearchParams } from '~/lib/searchParams.server';
import { tryCatch } from '~/lib/tryCatch.server';
import type { QueryType } from '~/types/types.server';
import { displayPrice } from '~/utils/displayPrice';
import type { Route } from './+types/income';

export function meta() {
	return [
		{ title: 'Your Income | Vanlife' },
		{
			name: 'income',
			content: 'Income from vans rented to others',
		},
	];
}

export function headers({ actionHeaders, loaderHeaders }: Route.HeadersArgs) {
	return actionHeaders ? actionHeaders : loaderHeaders;
}

export async function loader({ request }: Route.LoaderArgs) {
	const { session, headers: cookies } = await getSessionOrRedirect(request);

	// Parse search parameters for sorting
	const { sort } = loadHostSearchParams(request);

	const result = await tryCatch(() =>
		getHostTransactions(session.user.id, sort)
	);

	return data(
		{
			hostIncomes: result.data as QueryType<typeof getHostTransactions>,
		},
		{
			headers: {
				'Cache-Control': 'max-age=259200',
				...cookies,
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
		name: income.rentedAt.toDateString(),
		amount: Math.round(income.amount),
	}));

	return (
		<VanPages
			Component={Income}
			className="grid-max"
			emptyStateMessage="Rent some vans and your income will appear here."
			items={filteredHostIncomes}
			optionalElement={
				<>
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
				</>
			}
			pathname={href('/host/income')}
			renderKey={(item) => item.id}
			renderProps={(item) => item}
			title="Income"
		/>
	);
}
