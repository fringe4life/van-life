import { data, href } from 'react-router';
import BarChartComponent from '~/components/BarChart';
import Income from '~/components/Income';
import VanPages from '~/components/Van/VanPages';
import { getAccountSummary } from '~/db/getAccountSummary';
import { getHostTransactions } from '~/db/host/getHostTransactions';
import { getSessionOrRedirect } from '~/lib/getSessionOrRedirect';
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

export async function loader({ request }: Route.LoaderArgs) {
	const session = await getSessionOrRedirect(request);

	const [sumIncome, hostIncomes] = await Promise.all([
		getAccountSummary(session.user.id),
		getHostTransactions(session.user.id),
	]);
	return data(
		{
			sumIncome,
			hostIncomes,
		},
		{
			headers: {
				'Cache-Control': 'max-age=259200',
			},
		},
	);
}

export default function Host({ loaderData }: Route.ComponentProps) {
	const { sumIncome, hostIncomes } = loaderData;

	const mappedData = hostIncomes.map((income) => ({
		name: income.rentedAt.toDateString(),
		amount: Math.round(income.amount),
	}));

	return (
		<VanPages
			emptyStateMessage="Rent some vans and your income will appear here."
			className="grid-max"
			items={hostIncomes}
			renderKey={(item) => item.id}
			renderProps={(item) => item}
			Component={Income}
			itemsCount={hostIncomes.length}
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
