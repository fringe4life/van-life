import { data, href } from 'react-router';
import BarChartComponent from '~/components/host/BarChart';
import Income from '~/components/host/Income';
import VanPages from '~/components/van/VanPages';
import { getHostTransactions } from '~/db/user/analytics';
import { calculateTotalIncome, getElapsedTime } from '~/lib/getElapsedTime';
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

	const hostIncomes = await getHostTransactions(session.user.id);

	return data(
		{
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
							{elapsedTime.elapsedDays} days
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
