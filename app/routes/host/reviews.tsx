import { data, href } from 'react-router';
import GenericComponent from '~/components/generic-component';
import PendingUi from '~/components/pending-ui';
import Sortable from '~/components/sortable';
import UnsuccesfulState from '~/components/unsuccesful-state';
import { validateCUIDS } from '~/dal/validate-cuids';
import LazyBarChart from '~/features/host/components/bar-chart/lazy-bar-chart';
import Review from '~/features/host/components/review/review';
import {
	getHostReviewsChartData,
	getHostReviewsPaginated,
} from '~/features/host/queries/review/queries';
import { authContext } from '~/features/middleware/contexts/auth';
import { authMiddleware } from '~/features/middleware/functions/auth-middleware';
import Pagination from '~/features/pagination/components/pagination';
import { DEFAULT_LIMIT } from '~/features/pagination/pagination-constants';
import { hasPagination } from '~/features/pagination/utils/has-pagination.server';
import VanHeader from '~/features/vans/components/van-header';
import { loadHostSearchParams } from '~/lib/search-params.server';
import { tryCatch } from '~/utils/try-catch.server';
import type { Route } from './+types/reviews';
export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export async function loader({ request, context }: Route.LoaderArgs) {
	const user = context.get(authContext);

	// Parse search parameters for pagination and sorting
	const { cursor, limit, direction, sort } = loadHostSearchParams(request);

	// Load chart data and paginated reviews
	const [chartDataResult, paginatedReviewsResult] = await Promise.all([
		tryCatch(() => validateCUIDS(getHostReviewsChartData, [0])(user.id)),
		tryCatch(() => {
			const getWithUserId = async (userId: string) =>
				getHostReviewsPaginated({
					userId,
					cursor,
					limit,
					direction,
					sort,
				});
			return validateCUIDS(getWithUserId, [0])(user.id);
		}),
	]);

	const chartData = chartDataResult.data;
	const paginatedReviews = paginatedReviewsResult.data;

	// Process pagination logic
	const pagination = hasPagination(paginatedReviews, limit, cursor, direction);

	return data(
		{
			chartData,
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

	let barChartElement = (
		<UnsuccesfulState isError message="No reviews data available" />
	);

	if (chartData) {
		const result = chartData
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
		barChartElement = <LazyBarChart mappedData={result} />;
	}

	// For the chart, use chart data to show complete statistics

	// Use paginated reviews for the list display
	const reviewItems = paginatedReviews?.map((review) => ({
		name: review.user.user.name,
		text: review.text,
		rating: review.rating,
		timestamp:
			review.updatedAt?.toLocaleDateString() ??
			review.createdAt.toLocaleDateString(),
		id: review.id,
	})); // Pass error string directly to GenericComponent

	const limit = DEFAULT_LIMIT;

	return (
		<PendingUi
			as="section"
			className="grid grid-rows-[min-content_var(--chart-height)_min-content_1fr_min-content] contain-content"
		>
			<title>Reviews | Van Life</title>
			<meta
				content="View reviews and ratings from your van rentals"
				name="description"
			/>
			<VanHeader>Your Reviews</VanHeader>

			{barChartElement}
			<Sortable itemCount={chartData?.length} title="Reviews" />

			<GenericComponent
				as="div"
				Component={Review}
				className="grid-max mt-6"
				emptyStateMessage="You have received no reviews"
				items={reviewItems}
				renderProps={(item) => item}
			/>
			<Pagination
				cursor={undefined}
				hasNextPage={hasNextPage}
				hasPreviousPage={hasPreviousPage}
				items={reviewItems}
				limit={limit}
				pathname={href('/host/review')}
			/>
		</PendingUi>
	);
}
