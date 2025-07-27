import { data, href } from 'react-router';
import BarChartComponent from '~/components/BarChart';
import Income from '~/components/host/Income';
import VanPages from '~/components/van/VanPages';
import { getAccountSummary } from '~/db/getAccountSummary';
import { getHostTransactions } from '~/db/host/getHostTransactions';
import { getSessionOrRedirect } from '~/lib/getSessionOrRedirect.server';
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
	const { session, headers } = await getSessionOrRedirect(request);

	const results = await Promise.allSettled([
		getAccountSummary(session.user.id),
		getHostTransactions(session.user.id),
	]);

	const [sumIncome, hostIncomes] = results.map((result) =>
		result.status === 'fulfilled'
			? result.value
			: 'There was an error getting this data.',
	);
	return data(
		{
			sumIncome: sumIncome as Awaited<ReturnType<typeof getAccountSummary>>,
			hostIncomes: hostIncomes as Awaited<
				ReturnType<typeof getHostTransactions>
			>,
		},
		{
			headers: {
				'Cache-Control': 'max-age=259200',
				...headers,
			},
		},
	);
}

export default function Host({ loaderData }: Route.ComponentProps) {
	const { sumIncome, hostIncomes } = loaderData;

	const filteredHostIncomes = Array.isArray(hostIncomes)
		? hostIncomes.filter((income) => income.amount > 0)
		: [];
	const mappedData = filteredHostIncomes.map((income) => ({
		name: income.rentedAt.toDateString(),
		amount: Math.round(income.amount),
	}));

	return (
		<VanPages
			emptyStateMessage="Rent some vans and your income will appear here."
			className="grid-max"
			items={filteredHostIncomes}
			renderKey={(item) => item.id}
			renderProps={(item) => item}
			Component={Income}
			itemsCount={filteredHostIncomes.length}
			optionalElement={
				<>
					<p>
						Last{' '}
						<span className="font-bold text-neutral-600 underline">
							30 days
						</span>
					</p>
					<p className="mt-8 mb-13 font-extrabold text-3xl sm:text-4xl md:text-5xl">
						{displayPrice(sumIncome)}
					</p>
					<BarChartComponent mappedData={mappedData} />
				</>
			}
			title="Income"
			pathname={href('/host/income')}
		/>
	);
}
