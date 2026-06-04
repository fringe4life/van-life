import {
	getHostReviewsChartData,
	getHostReviewsPaginated,
} from '~/features/host/dal/review.server';
import type { HostPaginatedPageParams } from '~/features/host/services/income.server';
import { toPagination } from '~/features/pagination/utils/to-pagination.server';
import type { UUIDv7 } from '~/types/ids.server';
import { tryCatch } from '~/utils/try-catch.server';

export async function loadReviewsPage(
	userId: UUIDv7,
	{ cursor, limit, direction, sort }: HostPaginatedPageParams
) {
	const [{ data: chartData }, { data: paginatedReviews }] = await Promise.all([
		tryCatch(() => getHostReviewsChartData(userId)),
		tryCatch(() =>
			getHostReviewsPaginated({
				userId,
				cursor,
				limit,
				direction,
				sort,
			})
		),
	]);

	const pagination = toPagination({
		items: paginatedReviews,
		limit,
		cursor,
		direction,
	});

	return {
		chartData,
		...pagination,
	};
}
