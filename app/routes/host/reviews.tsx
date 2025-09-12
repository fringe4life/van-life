import { data, href } from 'react-router';
import Sortable from '~/components/common/Sortable';
import LazyBarChart from '~/components/host/LazyBarChart';
import Review from '~/components/host/review/Review';
import VanPages from '~/components/van/VanPages';
import {
	getHostReviewsChartData,
	getHostReviewsPaginated,
} from '~/db/review/queries';
import { getSessionOrRedirect } from '~/lib/getSessionOrRedirect.server';
import { hasPagination } from '~/lib/hasPagination.server';
import { loadHostSearchParams } from '~/lib/searchParams.server';
import type { QueryType } from '~/types/types.server';
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
	const { session, headers: cookies } = await getSessionOrRedirect(request);

	// Parse search parameters for pagination and sorting
	const { cursor, limit, direction, sort } = loadHostSearchParams(request);

	// Load chart data and paginated reviews
	const results = await Promise.allSettled([
		getHostReviewsChartData(session.user.id),
		getHostReviewsPaginated({
			userId: session.user.id,
			cursor,
			limit,
			direction,
			sort,
		}),
	]);

	const [chartData, paginatedReviews] = results.map((result) =>
		result.status === 'fulfilled' ? result.value : 'Error fetching data'
	);

	// Process pagination logic
	const pagination = hasPagination(
		paginatedReviews as QueryType<typeof getHostReviewsPaginated>,
		limit,
		cursor,
		direction
	);

	return data(
		{
			chartData: chartData as
				| QueryType<typeof getHostReviewsChartData>
				| string, // For chart data (only ratings)

			...pagination,
		},
		{
			headers: {
				'Cache-Control': 'max-age=259200',
				...cookies,
			},
		}
	);
}

export default function Reviews({ loaderData }: Route.ComponentProps) {
	const {
		chartData,
		actualItems: paginatedReviews,
		hasNextPage,
		hasPreviousPage,
	} = loaderData;

	// Handle case where data might be an error string or null
	const safeChartData = Array.isArray(chartData) ? chartData : [];

	// For the chart, use chart data to show complete statistics
	const result = safeChartData
		.reduce(
			(acc, cur) => {
				acc[cur.rating - 1] += 1;
				return acc;
			},
			[0, 0, 0, 0, 0]
		)
		.map((res, index) => ({
			name: `${index + 1}`,
			amount: res,
		}));

	// Use paginated reviews for the list display
	const reviewItems = Array.isArray(paginatedReviews)
		? paginatedReviews.map((review) => ({
				name: review.user.user.name,
				text: review.text,
				rating: review.rating,
				timestamp:
					review.updatedAt?.toLocaleDateString() ??
					review.createdAt.toLocaleDateString(),
				id: review.id,
			}))
		: []; // Pass error string directly to GenericComponent

	return (
		<VanPages
			// generic component props start
			Component={Review}
			emptyStateMessage="You have received no reviews"
			hasNextPage={hasNextPage}
			hasPreviousPage={hasPreviousPage}
			// props to handle errors
			items={reviewItems}
			// props that are common
			optionalElement={
				<>
					<LazyBarChart mappedData={result} />
					<Sortable itemCount={safeChartData.length} title="Reviews" />
				</>
			}
			pathname={href('/host/review')}
			// pagination props
			renderKey={(item) => item.id}
			renderProps={(item) => item}
			// optional
			title="Your Reviews"
		/>
	);
}
