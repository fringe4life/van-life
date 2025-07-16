import { data, href } from 'react-router';

import BarChartComponent from '~/components/BarChart';
import Review from '~/components/Review';
import VanPages from '~/components/Van/VanPages';
import { getHostReviews } from '~/db/host/getHostReviews';
import { getSessionOrRedirect } from '~/lib/auth/getSessionOrRedirect';
import type { Route } from './+types/reviews';
export function meta() {
	return [
		{ title: 'Reviews | Vanlife' },
		{
			name: 'description',
			content: 'The Reviews you have received',
		},
	];
}

export async function loader({ request }: Route.LoaderArgs) {
	const session = await getSessionOrRedirect(request);

	const reviews = await getHostReviews(session.user.id);

	return data(
		{
			reviews,
		},
		{
			headers: {
				'Cache-Control': 'max-age=259200',
			},
		},
	);
}

export default function Reviews({ loaderData }: Route.ComponentProps) {
	const { reviews } = loaderData;

	const result = reviews
		.reduce(
			(acc, cur) => {
				console.log({ acc });
				acc[cur.rating - 1] += 1;
				return acc;
			},
			[0, 0, 0, 0, 0],
		)
		.map((res, index) => ({
			name: `${index + 1}`,
			amount: res,
		}));

	const reviewItems = reviews.map((review) => ({
		name: review.user.user.name,
		text: review.text,
		rating: review.rating,
		timestamp:
			review.updatedAt?.toLocaleDateString() ?? review.createdAt.toDateString(),
		id: review.id,
	}));

	return (
		<VanPages
			itemsCount={reviews.length}
			// generic componet props start
			Component={Review}
			items={reviewItems}
			renderProps={(item) => item}
			renderKey={(item) => item.id}
			// props to handle errors
			emptyStateMessage="You have received no reviews"
			// props that are common
			title="Your Reviews"
			pathname={href('/host/review')}
			// optional
			optionalElement={
				<>
					<BarChartComponent mappedData={result} />

					<h3 className="font-bold text-lg text-text">
						Reviews ({reviews.length})
					</h3>
				</>
			}
		/>
	);
}
