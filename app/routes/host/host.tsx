import { data, href, useParams } from 'react-router';
import GenericComponent from '~/components/common/GenericComponent';
import PendingUI from '~/components/common/PendingUI';
import RatingStars from '~/components/host/review/RatingStars';
import CustomLink from '~/components/navigation/CustomLink';
import VanCard from '~/components/van/VanCard';
import { getAverageReviewRating } from '~/db/review/analytics';
import { getHostTransactions } from '~/db/user/analytics';
import { getHostVans } from '~/db/van/host';
import { calculateTotalIncome, getElapsedTime } from '~/lib/getElapsedTime';
import { getSessionOrRedirect } from '~/lib/getSessionOrRedirect.server';
import type { QueryType } from '~/types/types.server';
import { displayPrice } from '~/utils/displayPrice';
import type { Route } from './+types/host';

export function meta() {
	return [
		{ title: 'Host | Vanlife' },
		{
			name: 'description',
			content: 'the dashboard page when you are logged in',
		},
	];
}

export function headers({ actionHeaders, loaderHeaders }: Route.HeadersArgs) {
	return actionHeaders ? actionHeaders : loaderHeaders;
}

export async function loader({ request }: Route.LoaderArgs) {
	const { session, headers: cookies } = await getSessionOrRedirect(request);

	const results = await Promise.allSettled([
		// biome-ignore lint/style/noMagicNumbers: just getting the first three vans
		getHostVans(session.user.id, undefined, 3),
		getHostTransactions(session.user.id),
		getAverageReviewRating(session.user.id),
	]);

	const [vans, transactions, avgRating] = results.map((result) =>
		result.status === 'fulfilled'
			? result.value
			: 'There was an error getting this data.'
	);

	return data(
		{
			vans: vans as QueryType<typeof getHostVans>,
			avgRating: avgRating as QueryType<typeof getAverageReviewRating>,
			name: session.user.name,
			transactions: transactions as QueryType<typeof getHostTransactions>,
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
	const { vans, avgRating, name, transactions } = loaderData;

	// Calculate income and elapsed time client-side
	const sumIncome = Array.isArray(transactions)
		? calculateTotalIncome(transactions)
		: 0;
	const elapsedTime = Array.isArray(transactions)
		? getElapsedTime(transactions)
		: { elapsedDays: 0, description: 'No data' };

	return (
		<PendingUI as="section" className="mx-auto">
			<div className="grid grid-cols-[1fr_fit-content] items-center justify-between bg-orange-100 px-3 py-6 sm:px-6.5 sm:py-9">
				<h2 className="col-start-1 font-bold text-2xl text-neutral-900 sm:text-3xl md:text-4xl">
					Welcome {name ? name : 'User'}!
				</h2>
				<p className="col-start-1 my-4 font-light text-base text-neutral-600 sm:my-6 md:my-8">
					Income last{' '}
					<span className="font-medium underline">
						{elapsedTime.elapsedDays} days
					</span>
				</p>
				<p className="col-start-1 font-extrabold text-2xl text-neutral-900 xs:text-3xl sm:text-4xl md:text-5xl">
					{displayPrice(sumIncome)}
				</p>
				<CustomLink
					className="col-start-2 row-start-2"
					to={href('/host/income')}
				>
					Details
				</CustomLink>
			</div>
			<div className="flex items-center justify-between bg-orange-200 px-3 py-6 sm:px-6.5 sm:py-9">
				<div className="font-bold text-lg text-shadow-text sm:text-2xl">
					{typeof avgRating === 'number' ? (
						<span>
							Your Avg Review <RatingStars rating={avgRating} />
						</span>
					) : (
						<span>something went wrong</span>
					)}
				</div>
				<CustomLink
					className="font-medium text-base text-shadow-text"
					to={href('/host/review')}
				>
					Details
				</CustomLink>
			</div>
			<GenericComponent
				Component={VanCard}
				className="grid-max mt-11"
				emptyStateMessage="You are not currently renting any vans"
				items={vans}
				renderKey={(item) => item.id}
				renderProps={(item) => ({
					van: item,
					link: href('/host/vans/:vanId', { vanId: item.id }),
					action: <p className="justify-self-end text-right">Edit</p>,
				})}
			/>
		</PendingUI>
	);
}

export function ErrorBoundary() {
	const message = 'Oops!';
	const details = 'An unexpected error occurred. Please try again later';

	const params = useParams();
	return (
		<main className="container mx-auto p-4 pt-16">
			<h1>{message}</h1>
			<p>{details}</p>
			{Object.entries(params).length >= 1 && (
				<p>
					Your Van could not be found. Add it here{' '}
					<CustomLink to={href('/host/add')}>Add a new Van</CustomLink>
				</p>
			)}
		</main>
	);
}
