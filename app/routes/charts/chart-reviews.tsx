import { data } from 'react-router';
import { validateCUIDS } from '~/dal/validate-cuids';
import { getHostReviewsChartData } from '~/features/host/queries/review/queries';
import { authContext } from '~/features/middleware/contexts/auth';
import { authMiddleware } from '~/features/middleware/functions/auth-middleware';
import { tryCatch } from '~/utils/try-catch.server';
import type { Route } from './+types/chart-reviews';

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
	const user = context.get(authContext);

	const reviews = await tryCatch(() =>
		validateCUIDS(getHostReviewsChartData, [0])(user.id)
	);

	return data({ reviews });
}
