import clsx from 'clsx';
import { data, href } from 'react-router';
import CustomLink from '~/components/CustomLink';
import GenericComponent from '~/components/GenericComponent';
import VanCard from '~/components/Van/VanCard';
import { getAccountSummary } from '~/db/getAccountSummary';
import { getAverageReviewRating } from '~/db/getAvgReviews';
import { getHostVans } from '~/db/host/getHostVans';
import useIsNavigating from '~/hooks/useIsNavigating';
import { getSessionOrRedirect } from '~/lib/auth/getSessionOrRedirect';
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

export async function loader({ request }: Route.LoaderArgs) {
	const session = await getSessionOrRedirect(request);

	const [vans, sumIncome, avgRating] = await Promise.all([
		getHostVans(session.user.id, 1, 3),
		getAccountSummary(session.user.id),
		getAverageReviewRating(session.user.id),
	]);

	return data(
		{
			vans,
			sumIncome,
			avgRating,
			name: session.user.name,
		},
		{
			headers: {
				'Cache-Control': 'max-age=259200',
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
				<h2 className="col-start-1 font-bold text-neutral-900 text-xl sm:text-2xl md:text-4xl">
					Welcome {name ? name : 'User'}!
				</h2>
				<p className="col-start-1 my-4 font-light text-base text-neutral-600 sm:my-6 md:my-8">
					Income last <span className="font-medium underline">30 days</span>
				</p>
				<p className="col-start-1 font-extrabold text-2xl text-neutral-900 sm:text-4xl md:text-5xl">
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
					Review Score star {avgRating.toFixed(1)}/5
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
					action: <p className="justify-self-end">Edit</p>,
				})}
			/>
		</section>
	);
}
