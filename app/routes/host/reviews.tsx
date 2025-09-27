import { data, href } from 'react-router';
import Sortable from '~/components/sortable';
import {
	getHostReviewsChartData,
	getHostReviewsPaginated,
} from '~/db/review/queries';
import LazyBarChart from '~/features/host/components/lazy-bar-chart';
import Review from '~/features/host/components/review/review';
import { authContext } from '~/features/middleware/contexts/auth';
import { authMiddleware } from '~/features/middleware/functions/auth-middleware';
import { hasPagination } from '~/features/pagination/utils/has-pagination.server';
import VanPages from '~/features/vans/components/van-pages';
import { loadHostSearchParams } from '~/lib/search-params.server';
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

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export function headers({ actionHeaders, loaderHeaders }: Route.HeadersArgs) {
	return actionHeaders ? actionHeaders : loaderHeaders;
}

export async function loader({ request, context }: Route.LoaderArgs) {
	const session = context.get(authContext);

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
