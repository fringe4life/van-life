import { data, href } from 'react-router';

import BarChartComponent from '~/components/BarChart';
import Review from '~/components/Review';
import VanPages from '~/components/Van/VanPages';
import { getHostReviews } from '~/db/host/getHostReviews';
import { getSessionOrRedirect } from '~/lib/getSessionOrRedirect.server';
import { tryCatch } from '~/lib/tryCatch';
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

export function headers({ actionHeaders, loaderHeaders }: Route.HeadersArgs) {
	return actionHeaders ? actionHeaders : loaderHeaders;
}

export async function loader({ request }: Route.LoaderArgs) {
	const { session, headers } = await getSessionOrRedirect(request);

	const result = await tryCatch(() => getHostReviews(session.user.id));

	if (result.error) {
		throw new Error('Failed to load reviews. Please try again later.');
	}

	return data(
		{
			reviews: result.data,
		},
		{
			headers: {
				'Cache-Control': 'max-age=259200',
				...headers,
			},
		},
	);
}

export default function Reviews({ loaderData }: Route.ComponentProps) {
	const { reviews } = loaderData;

	// Handle case where reviews might be null (though it shouldn't be due to error handling above)
	const safeReviews = Array.isArray(reviews) ? reviews : [];

	const result = safeReviews
		.reduce(
			(acc, cur) => {
				acc[cur.rating - 1] += 1;
				return acc;
			},
			[0, 0, 0, 0, 0],
		)
		.map((res, index) => ({
			name: `${index + 1}`,
			amount: res,
		}));

	const reviewItems = safeReviews.map((review) => ({
		name: review.user.user.name,
		text: review.text,
		rating: review.rating,
		timestamp:
			review.updatedAt?.toLocaleDateString() ??
			review.createdAt.toLocaleDateString(),
		id: review.id,
	}));

	return (
		<VanPages
			itemsCount={safeReviews.length}
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

					<h3 className="font-bold text-lg text-neutral-900">
						Reviews ({safeReviews.length})
					</h3>
				</>
			}
		/>
	);
}
