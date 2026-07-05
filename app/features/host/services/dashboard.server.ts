import { getAverageReviewRating } from '~/features/host/dal/review-analytics.server';
import {
	getHostTransactions,
	getTransactionSummary,
} from '~/features/host/dal/transaction.server';
import { getHostVans } from '~/features/vans/dal/host-van.server';
import type { UUIDv7 } from '~/types/ids.server';
import { tryCatch } from '~/utils/try-catch.server';

const HOST_VANS_LIMIT = 2;

export async function loadHostDashboard(userId: UUIDv7) {
	const vansPromise = Promise.resolve(
		getHostVans(userId, {
			cursor: undefined,
			direction: 'forward',
			limit: HOST_VANS_LIMIT,
		})
	);

	const [
		{ data: transactions },
		{ data: avgRating },
		{ data: transactionSummary },
	] = await Promise.all([
		tryCatch(() => getHostTransactions(userId)),
		tryCatch(() => getAverageReviewRating(userId)),
		tryCatch(() => getTransactionSummary(userId)),
	]);

	return {
		avgRating: avgRating ?? 0,
		transactionSummary: transactionSummary ?? 0,
		transactions,
		vansPromise,
	};
}
