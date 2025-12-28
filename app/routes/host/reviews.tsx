import { data } from 'react-router';
import { GenericComponent } from '~/components/generic-component';
import { PendingUI } from '~/components/pending-ui';
import Sortable from '~/components/sortable';
import { validateCUIDS } from '~/dal/validate-cuids';
import LazyBarChart from '~/features/host/components/bar-chart/lazy-bar-chart';
import Review from '~/features/host/components/review/review';
import {
	getHostReviewsChartData,
	getHostReviewsPaginated,
} from '~/features/host/queries/review/queries';
import { authContext } from '~/features/middleware/contexts/auth';
import { authMiddleware } from '~/features/middleware/functions/auth-middleware';
import { Pagination } from '~/features/pagination/components/pagination';
import { toPagination } from '~/features/pagination/utils/to-pagination.server';
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
	const [{ data: chartData }, { data: paginatedReviews }] = await Promise.all([
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

	// Process pagination logic
	const pagination = toPagination({
		items: paginatedReviews,
		limit,
		cursor,
		direction,
	});

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

export default function HostReviews({ loaderData }: Route.ComponentProps) {
	const { chartData, items: paginatedReviews, paginationMetadata } = loaderData;

	const result = chartData
		?.reduce(
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

	return (
		<PendingUI
			as="section"
			className="grid grid-rows-[min-content_var(--chart-height)_min-content_1fr_min-content] contain-content"
		>
			<title>Reviews | Van Life</title>
			<meta
				content="View reviews and ratings from your van rentals"
				name="description"
			/>
			<VanHeader>Your Reviews</VanHeader>

			<LazyBarChart
				data={result}
				emptyStateMessage="You have no reviews"
				errorStateMessage="Something went wrong please try again"
			/>
			<Sortable itemCount={chartData?.length} title="Reviews" />

			<GenericComponent
				as="div"
				Component={Review}
				className="grid-max mt-6"
				emptyStateMessage="You have received no reviews"
				errorStateMessage="Something went wrong"
				items={paginatedReviews}
				renderKey={(item) => item.id}
				renderProps={({ user, text, rating, updatedAt, createdAt, id }) => ({
					name: user.user.name,
					text,
					rating,
					timestamp:
						updatedAt?.toLocaleDateString() ?? createdAt.toLocaleDateString(),
					id,
				})}
			/>
			<Pagination
				items={paginatedReviews}
				paginationMetadata={paginationMetadata}
			/>
		</PendingUI>
	);
}
