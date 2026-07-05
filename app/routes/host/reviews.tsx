import { data } from 'react-router';
import { GenericComponent } from '~/components/generic-component';
import { PendingUI } from '~/components/pending-ui';
import { Sortable } from '~/components/sortable';
import { LazyBarChart } from '~/features/host/components/bar-chart/lazy-bar-chart';
import Review from '~/features/host/components/review/review';
import { loadReviewsPage } from '~/features/host/services/reviews.server';
import { authContext } from '~/features/middleware/contexts/auth';
import { Pagination } from '~/features/pagination/components/pagination';
import { VanHeader } from '~/features/vans/components/van-header';
import type { ReviewModel, UserModel } from '~/generated/prisma/models';
import {
	loadHostSearchParams,
	parsePaginationCursor,
} from '~/lib/search-params.server';
import type { Prettify } from '~/types';
import type { Route } from './+types/reviews';

type ReviewListItem = Prettify<ReviewModel & { user: Pick<UserModel, 'name'> }>;

const renderReviewProps = ({
	user,
	text,
	rating,
	updatedAt,
	createdAt,
	id,
}: ReviewListItem) => ({
	id,
	name: user.name,
	rating,
	text,
	timestamp: updatedAt?.toLocaleDateString() ?? createdAt.toLocaleDateString(),
});

export const loader = async ({ request, context }: Route.LoaderArgs) => {
	const user = context.get(authContext);

	// Parse search parameters for pagination and sorting
	const { cursor, limit, direction, sort } = loadHostSearchParams(request);
	const page = await loadReviewsPage(user.id, {
		cursor: parsePaginationCursor(cursor),
		direction,
		limit,
		sort,
	});

	return data(page, {
		headers: {
			'Cache-Control': 'max-age=259200',
		},
	});
};

const HostReviews = ({ loaderData }: Route.ComponentProps) => {
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
			amount: res,
			name: `${index + 1}`,
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
				renderProps={renderReviewProps}
			/>
			<Pagination
				items={paginatedReviews}
				paginationMetadata={paginationMetadata}
			/>
		</PendingUI>
	);
};
export default HostReviews;
