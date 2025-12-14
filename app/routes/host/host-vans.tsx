import { Activity } from 'react';
import { data, href } from 'react-router';
import GenericComponent from '~/components/generic-component';
import PendingUi from '~/components/pending-ui';
import UnsuccesfulState from '~/components/unsuccesful-state';
import { validateCUIDS } from '~/dal/validate-cuids';
import { determineHostVansRoute } from '~/features/host/utils/determine-host-vans-route';
import { authContext } from '~/features/middleware/contexts/auth';
import { authMiddleware } from '~/features/middleware/functions/auth-middleware';
import CustomLink from '~/features/navigation/components/custom-link';
import Pagination from '~/features/pagination/components/pagination';
import { toPagination } from '~/features/pagination/utils/to-pagination.server';
import VanDetailCard from '~/features/vans/components/host-van-detail-card';
import VanCard from '~/features/vans/components/van-card';
import VanHeader from '~/features/vans/components/van-header';
import { getHostVans } from '~/features/vans/queries/host';
import { loadHostSearchParams } from '~/lib/search-params.server';
import { tryCatch } from '~/utils/try-catch.server';
import type { Route } from './+types/host-vans';

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export async function loader({ request, context }: Route.LoaderArgs) {
	const user = context.get(authContext);

	// Parse search parameters using nuqs loadHostSearchParams
	const { cursor, limit, direction } = loadHostSearchParams(request);

	const { data: vans } = await tryCatch(() =>
		validateCUIDS(getHostVans, [0])(user.id, cursor, limit, direction)
	);

	// Process pagination logic
	const pagination = toPagination(vans, limit, cursor, direction);

	return data(
		{
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
	const { items: vans, hasNextPage, hasPreviousPage } = loaderData;

	// Determine route state using utility helper
	const {
		isMainPage,
		isDetailPage,
		isInitialDetailPage,
		isPhotosPage,
		isPricingPage,
		selectedVan,
	} = determineHostVansRoute(params, vans);
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
						errorStateMessage="Something went wrong"
						items={vans}
						renderKey={(van) => van.id}
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
						hasNextPage={hasNextPage}
						hasPreviousPage={hasPreviousPage}
						items={vans}
					/>
				</PendingUi>
			</Activity>
		</>
	);
}
