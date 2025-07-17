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
			<div className="grid grid-cols-[auto_fit-content] items-center justify-between bg-orange-100 px-6.5 py-9">
				<h2 className="col-start-1 font-bold text-4xl text-text">
					Welcome {name ? name : 'User'}!
				</h2>
				<p className="col-start-1 my-8 font-light text-base text-text-secondary">
					Income last <span className="font-medium underline">30 days</span>
				</p>
				<p className="col-start-1 font-extrabold text-5xl text-text">
					{displayPrice(sumIncome)}
				</p>
				<CustomLink
					to={href('/host/income')}
					className="col-start-2 row-start-2"
				>
					Details
				</CustomLink>
			</div>
			<div className="flex justify-between bg-orange-200 px-6.5 py-11 ">
				<p className="font-bold text-2xl text-shadow-text">
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
					'grid-max grid-max-medium mt-11': true,
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
