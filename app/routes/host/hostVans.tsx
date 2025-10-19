import { useQueryStates } from 'nuqs';
import { Activity } from 'react';
import { data, href } from 'react-router';
import UnsuccesfulState from '~/components/unsuccesful-state';
import { getHostVanCount, getHostVans } from '~/db/van/host';
import { determineHostVansRoute } from '~/features/host/utils/determine-host-vans-route';
import { authContext } from '~/features/middleware/contexts/auth';
import { authMiddleware } from '~/features/middleware/functions/auth-middleware';
import CustomLink from '~/features/navigation/components/custom-link';
import { hasPagination } from '~/features/pagination/utils/has-pagination.server';
import VanDetailCard from '~/features/vans/components/host-van-detail-card';
import VanCard from '~/features/vans/components/van-card';
import VanPages from '~/features/vans/components/van-pages';
import { hostPaginationParsers } from '~/lib/parsers';
import { loadHostSearchParams } from '~/lib/search-params.server';
import { tryCatch } from '~/utils/try-catch.server';
import type { Route } from './+types/hostVans';

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export async function loader({ request, context }: Route.LoaderArgs) {
	const session = context.get(authContext);

	// Parse search parameters using nuqs loadHostSearchParams
	const { cursor, limit, direction } = loadHostSearchParams(request);

	const [vansResult, countResult] = await Promise.all([
		tryCatch(
			async () => await getHostVans(session.user.id, cursor, limit, direction)
		),
		tryCatch(async () => await getHostVanCount(session.user.id)),
	]);

	const vans = vansResult.data ?? [];
	const vansCount = countResult.data ?? 0;

	// Process pagination logic
	const pagination = hasPagination(vans, limit, cursor, direction);

	return data(
		{
			vansCount,
			...pagination,
		},
		{
			headers: {
				'Cache-Control': 'max-age=259200',
			},
		}
	);
}

export default function Host({ loaderData, params }: Route.ComponentProps) {
	const { actualItems: vans, hasNextPage, hasPreviousPage } = loaderData;

	// Use nuqs for client-side state management
	const [{ cursor, limit }] = useQueryStates(hostPaginationParsers);

	// Ensure vans is an array
	const vansArray = Array.isArray(vans) ? vans : [];

	// Determine route state using utility helper
	const {
		isMainPage,
		isDetailPage,
		isInitialDetailPage,
		isPhotosPage,
		isPricingPage,
		selectedVan,
	} = determineHostVansRoute(params, vansArray);
	return (
		<>
			<title>Your Vans | Van Life</title>
			<meta
				content="View and manage your listed vans on Van Life"
				name="description"
			/>
			<Activity mode={isDetailPage ? 'visible' : 'hidden'}>
				{selectedVan ? (
					<VanDetailCard van={selectedVan}>
						<Activity mode={isInitialDetailPage ? 'visible' : 'hidden'}>
							<VanDetailCard.Details />
						</Activity>
						<Activity mode={isPhotosPage ? 'visible' : 'hidden'}>
							<VanDetailCard.Photos />
						</Activity>
						<Activity mode={isPricingPage ? 'visible' : 'hidden'}>
							<VanDetailCard.Pricing />
						</Activity>
					</VanDetailCard>
				) : (
					<UnsuccesfulState message="Could not find selected van" />
				)}
			</Activity>
			<Activity mode={isMainPage ? 'visible' : 'hidden'}>
				<VanPages
					// generic component props start
					Component={VanCard}
					className="grid-max"
					emptyStateMessage="You are currently not renting any vans."
					hasNextPage={hasNextPage}
					hasPreviousPage={hasPreviousPage}
					items={vansArray}
					// generic component props end

					// props for all use cases
					pathname={href('/host/vans/:vanSlug?/:action?')}
					renderProps={(van) => ({
						link: href('/host/vans/:vanSlug?/:action?', { vanSlug: van.slug }),
						van,
						action: (
							<p className="text-right">
								<CustomLink
									to={href('/host/vans/:vanSlug?/:action?', {
										vanSlug: van.slug,
										action: 'edit',
									})}
								>
									Edit
								</CustomLink>
							</p>
						),
					})}
					searchParams={{ cursor, limit }}
					title="Your listed vans"
				/>
			</Activity>
		</>
	);
}
