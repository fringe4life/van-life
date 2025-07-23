import type { Van } from '@prisma/client';
import clsx from 'clsx';
import { data, href, useParams } from 'react-router';
import CustomLink from '~/components/CustomLink';
import GenericComponent from '~/components/GenericComponent';
import VanCard from '~/components/Van/VanCard';
import { getAccountSummary } from '~/db/getAccountSummary';
import { getAverageReviewRating } from '~/db/getAvgReviews';
import { getHostVans } from '~/db/host/getHostVans';
import useIsNavigating from '~/hooks/useIsNavigating';
import { getSessionOrRedirect } from '~/lib/getSessionOrRedirect.server';
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
	const session = await getSessionOrRedirect(request);

	const results = await Promise.allSettled([
		getHostVans(session.user.id, 1, 3),
		getAccountSummary(session.user.id),
		getAverageReviewRating(session.user.id),
	]);

	const [vans, sumIncome, avgRating] = results.map((result) =>
		result.status === 'fulfilled'
			? result.value
			: 'There was an error getting this data.',
	);

	return data(
		{
			vans: vans as Van[] | string,
			sumIncome: sumIncome as number | string,
			avgRating: avgRating as number | string,
			name: session.user.name,
		},
		{
			headers: {
				'Cache-Control': 'max-age=259200',
				// ...request.headers,
			},
		},
	);
}

export default function Host({ loaderData }: Route.ComponentProps) {
	const { vans, sumIncome, avgRating, name } = loaderData;

	const { changingPage } = useIsNavigating();
	return (
		<section>
			<div className="grid grid-cols-[1fr_fit-content] items-center justify-between bg-orange-100 px-3 py-6 sm:px-6.5 sm:py-9">
				<h2 className="col-start-1 font-bold text-2xl text-neutral-900 sm:text-3xl md:text-4xl">
					Welcome {name ? name : 'User'}!
				</h2>
				<p className="col-start-1 my-4 font-light text-base text-neutral-600 sm:my-6 md:my-8">
					Income last <span className="font-medium underline">30 days</span>
				</p>
				<p className="col-start-1 font-extrabold text-3xl text-neutral-900 sm:text-4xl md:text-5xl">
					{displayPrice(sumIncome)}
				</p>
				<CustomLink
					to={href('/host/income')}
					className="col-start-2 row-start-2"
				>
					Details
				</CustomLink>
			</div>
			<div className="flex justify-between bg-orange-200 px-3 py-6 sm:px-6.5 sm:py-9 ">
				<p className="font-bold text-lg text-shadow-text sm:text-2xl">
					Review Score star{' '}
					{typeof avgRating === 'number'
						? avgRating.toFixed(1)
						: (avgRating ?? 'unknown')}
					/5
				</p>
				<CustomLink
					to={href('/host/review')}
					className="font-medium text-base text-shadow-text"
				>
					Details
				</CustomLink>
			</div>
			<GenericComponent
				emptyStateMessage="You are not currently renting any vans"
				items={vans}
				Component={VanCard}
				className={clsx({
					'grid-max mt-11': true,
					'opacity-75': changingPage,
				})}
				renderKey={(item) => item.id}
				renderProps={(item) => ({
					van: item,
					link: href('/host/vans/:vanId', { vanId: item.id }),
					action: <p className="justify-self-end text-right">Edit</p>,
				})}
			/>
		</section>
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
					Your Van could not be found. Add i{' '}
					<CustomLink to={href('/host/add')}>Add a new Van</CustomLink>
				</p>
			)}
		</main>
	);
}
