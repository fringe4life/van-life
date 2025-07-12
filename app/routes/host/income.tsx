import clsx from 'clsx';
import { data } from 'react-router';
import {
	Bar,
	BarChart,
	CartesianGrid,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import GenericComponent from '~/components/GenericComponent';
import Income from '~/components/Income';
import { getAccountSummary } from '~/db/getAccountSummary';
import { getHostTransactions } from '~/db/getHostTransactions';
import useIsNavigating from '~/hooks/useIsNavigating';
import { getSessionOrRedirect } from '~/lib/auth/getSessionOrRedirect';
import { displayPrice } from '~/utils/displayPrice';
import type { Route } from './+types/income';
export function meta(_: Route.MetaArgs) {
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

	const sumIncome = await getAccountSummary(session.user.id);

	const hostIncomes = await getHostTransactions(session.user.id);
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

	console.log({ sumIncome, hostIncomes });

	const mappedData = hostIncomes.map((income) => ({
		name: new Date().getDate().toLocaleString(),
		amount: Math.round(income.amount),
	}));

	const { changingPage } = useIsNavigating();

	return (
		<div className={clsx({ 'opacity-75': changingPage })}>
			<h2 className="mt-13 mb-11 font-bold text-3xl">Income</h2>
			<p>
				Last{' '}
				<span className="font-bold text-text-secondary underline">30 days</span>
			</p>
			<p className="mt-8 mb-13 font-extrabold text-5xl">
				{displayPrice(sumIncome)}
			</p>
			<ResponsiveContainer width="100%" height={350}>
				<BarChart data={mappedData}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="name" />
					<YAxis />
					<Tooltip />
					<Legend />
					<Bar dataKey="amount" fill="oklch(75.27% 0.167 52.58)" />
				</BarChart>
			</ResponsiveContainer>
			<GenericComponent
				emptyStateMessage="Rent some vans and your income will appear here."
				className="grid-max"
				items={hostIncomes}
				renderKey={(item) => item.id}
				renderProps={(item) => ({
					...item,
					amount: item.amount,
				})}
				Component={Income}
			/>
		</div>
	);
}
