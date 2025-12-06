import { useQueryStates } from 'nuqs';
import { Activity } from 'react';
import { data, href, type ShouldRevalidateFunctionArgs } from 'react-router';
import GenericComponent from '~/components/generic-component';
import PendingUi from '~/components/pending-ui';
import UnsuccesfulState from '~/components/unsuccesful-state';
import { validateCUIDS } from '~/dal/validate-cuids';
import { determineHostVansRoute } from '~/features/host/utils/determine-host-vans-route';
import { authContext } from '~/features/middleware/contexts/auth';
import { authMiddleware } from '~/features/middleware/functions/auth-middleware';
import CustomLink from '~/features/navigation/components/custom-link';
import Pagination from '~/features/pagination/components/pagination';
import { DEFAULT_LIMIT } from '~/features/pagination/pagination-constants';
import { hasPagination } from '~/features/pagination/utils/has-pagination.server';
import VanDetailCard from '~/features/vans/components/host-van-detail-card';
import VanCard from '~/features/vans/components/van-card';
import VanHeader from '~/features/vans/components/van-header';
import { getHostVanCount, getHostVans } from '~/features/vans/queries/host';
import { hostPaginationParsers } from '~/lib/parsers';
import { loadHostSearchParams } from '~/lib/search-params.server';
import { tryCatch } from '~/utils/try-catch.server';
import type { Route } from './+types/host-vans';

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export async function loader({ request, context }: Route.LoaderArgs) {
	const session = context.get(authContext);

	// Parse search parameters using nuqs loadHostSearchParams
	const { cursor, limit, direction } = loadHostSearchParams(request);

	const [vansResult, countResult] = await Promise.all([
		tryCatch(() =>
			validateCUIDS(getHostVans, [0] as const)(
				session.user.id,
				cursor,
				limit,
				direction
			)
		),
		tryCatch(() =>
			validateCUIDS(getHostVanCount, [0] as const)(session.user.id)
		),
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

/**
 * Prevent loader revalidation when navigating between sub-routes of the same van.
 * E.g., /vans/silver-bullet/pricing → /vans/silver-bullet/photos
 * Only revalidate if vanSlug changes, pagination changes, or it's a form submission.
 */
export function shouldRevalidate({
	currentParams,
	nextParams,
	currentUrl,
	nextUrl,
	formMethod,
	defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
	// Always revalidate on form submissions
	if (formMethod && formMethod !== 'GET') {
		return true;
	}

	// If vanSlug changed, revalidate to fetch new van data
	if (currentParams.vanSlug !== nextParams.vanSlug) {
		return true;
	}

	// If pagination params changed, revalidate
	if (currentUrl.searchParams.toString() !== nextUrl.searchParams.toString()) {
		return true;
	}

	// Same van, same pagination, just changing action (pricing/photos/details)
	// No need to revalidate - we already have the van data
	if (
		currentParams.vanSlug === nextParams.vanSlug &&
		currentParams.action !== nextParams.action
	) {
		return false;
	}

	// Default behavior for all other cases
	return defaultShouldRevalidate;
}

export default function Host({ loaderData, params }: Route.ComponentProps) {
	const { actualItems: vans, hasNextPage, hasPreviousPage } = loaderData;

	// Use nuqs for client-side state management
	const [{ cursor, limit }] = useQueryStates(hostPaginationParsers);
	const effectiveLimit = limit ?? DEFAULT_LIMIT;

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
				<PendingUi
					as="section"
					className="grid grid-rows-[min-content_1fr_min-content] contain-content"
				>
					<VanHeader>Your listed vans</VanHeader>
					<GenericComponent
						as="div"
						Component={VanCard}
						className="grid-max mt-6"
						emptyStateMessage="You are currently not renting any vans."
						items={vansArray}
						renderProps={(van) => ({
							link: href('/host/vans/:vanSlug?/:action?', {
								vanSlug: van.slug,
							}),
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
					/>
					<Pagination
						cursor={cursor}
						hasNextPage={hasNextPage}
						hasPreviousPage={hasPreviousPage}
						items={vansArray}
						limit={effectiveLimit}
						pathname={href('/host/vans/:vanSlug?/:action?')}
					/>
				</PendingUi>
			</Activity>
		</>
	);
}
