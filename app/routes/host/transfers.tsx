import { data, href } from 'react-router';
import Sortable from '~/components/sortable';
import { getUserTransactions } from '~/db/user/analytics';
import Income from '~/features/host/components/income';
import LazyBarChart from '~/features/host/components/lazy-bar-chart';
import { authContext } from '~/features/middleware/contexts/auth';
import { authMiddleware } from '~/features/middleware/functions/auth-middleware';
import VanPages from '~/features/vans/components/van-pages';
import { displayPrice } from '~/features/vans/utils/display-price';
import { loadHostSearchParams } from '~/lib/search-params.server';
import type { QueryType } from '~/types/types.server';
import { getElapsedTime } from '~/utils/get-elapsed-time';
import { tryCatch } from '~/utils/try-catch.server';
import type { Route } from './+types/transfers';

export function meta() {
	return [
		{ title: 'Your Transfers | Vanlife' },
		{
			name: 'transfers',
			content: 'Transaction history for deposits and withdrawals',
		},
	];
}

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export function headers({ actionHeaders, loaderHeaders }: Route.HeadersArgs) {
	return actionHeaders ? actionHeaders : loaderHeaders;
}

export async function loader({ request, context }: Route.LoaderArgs) {
	const session = context.get(authContext);

	// Parse search parameters for sorting
	const { sort } = loadHostSearchParams(request);

	const result = await tryCatch(() =>
		getUserTransactions(session.user.id, sort)
	);

	return data(
		{
			userTransactions: result.data as QueryType<typeof getUserTransactions>,
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
		? userTransactions.reduce((total, transaction) => {
				return transaction.type === 'DEPOSIT'
					? total + transaction.amount
					: total - transaction.amount;
			}, 0)
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

	return (
		<VanPages
			Component={Income}
			className="grid-max"
			emptyStateMessage="Make some transactions and they will appear here."
			items={filteredTransactions}
			optionalElement={
				<>
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
				</>
			}
			pathname={href('/host/transfers')}
			renderKey={(item) => item.id}
			renderProps={(item) => ({
				...item,
				// Map transaction data to match Income component expectations
				amount: item.type === 'DEPOSIT' ? item.amount : -item.amount,
				rentedAt: item.createdAt,
			})}
			title="Transfers"
		/>
	);
}
