import { data, href, useParams } from 'react-router';
import GenericComponent from '~/components/generic-component';
import PendingUi from '~/components/pending-ui';
import { getAverageReviewRating } from '~/db/review/analytics';
import { getHostTransactions } from '~/db/user/analytics';
import { getHostVans } from '~/db/van/host';
import RatingStars from '~/features/host/components/review/rating-stars';
import { authContext } from '~/features/middleware/contexts/auth';
import { authMiddleware } from '~/features/middleware/functions/auth-middleware';
import CustomLink from '~/features/navigation/components/custom-link';
import VanCard from '~/features/vans/components/van-card';
import { displayPrice } from '~/features/vans/utils/display-price';
import { calculateTotalIncome, getElapsedTime } from '~/utils/get-elapsed-time';
import { tryCatch } from '~/utils/try-catch.server';
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

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export function headers({ actionHeaders, loaderHeaders }: Route.HeadersArgs) {
	return actionHeaders ? actionHeaders : loaderHeaders;
}

export async function loader({ context }: Route.LoaderArgs) {
	const session = context.get(authContext);

	const [vansResult, transactionsResult, avgRatingResult] = await Promise.all([
		// biome-ignore lint/style/noMagicNumbers: just getting the first three vans
		tryCatch(async () => await getHostVans(session.user.id, undefined, 3)),
		tryCatch(async () => await getHostTransactions(session.user.id)),
		tryCatch(async () => await getAverageReviewRating(session.user.id)),
	]);

	const vans = vansResult.data ?? [];
	const transactions = transactionsResult.data ?? [];
	const avgRating = avgRatingResult.data ?? 0;

	return data(
		{
			vans,
			avgRating,
			name: session.user.name,
			transactions,
		},
		{
			headers: {
				'Cache-Control': 'max-age=259200',
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
		<PendingUi as="section">
			<div className="-mx-[var(--padding-inline)] grid w-[var(--container-layout)] grid-cols-[1fr_fit-content] items-center justify-between bg-orange-100 px-[var(--padding-inline)] py-6 sm:py-9">
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
			<div className="-mx-[var(--padding-inline)] flex w-[var(--container-layout)] items-center justify-between bg-orange-200 px-[var(--padding-inline)] py-6 sm:py-9">
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
		</PendingUi>
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
