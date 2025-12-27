import { data, href } from 'react-router';
import GenericComponent from '~/components/generic-component';
import PendingUi from '~/components/pending-ui';
import { validateCUIDS } from '~/dal/validate-cuids';
import { getHostRentedVans } from '~/features/host/queries/rental/queries';
import { authContext } from '~/features/middleware/contexts/auth';
import { authMiddleware } from '~/features/middleware/functions/auth-middleware';
import CustomLink from '~/features/navigation/components/custom-link';
import { Pagination } from '~/features/pagination/components/pagination';
import { toPagination } from '~/features/pagination/utils/to-pagination.server';
import VanCard from '~/features/vans/components/van-card';
import VanHeader from '~/features/vans/components/van-header';
import { loadHostSearchParams } from '~/lib/search-params.server';
import { tryCatch } from '~/utils/try-catch.server';
import type { Route } from './+types/rentals';

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export async function loader({ request, context }: Route.LoaderArgs) {
	const user = context.get(authContext);

	// Parse search parameters using nuqs loadHostSearchParams
	const { cursor, limit, direction } = loadHostSearchParams(request);

	const { data: vans } = await tryCatch(() =>
		validateCUIDS(getHostRentedVans, [0])(user.id, cursor, limit, direction)
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

export default function Host({ loaderData }: Route.ComponentProps) {
	const { items: vans, hasNextPage, hasPreviousPage } = loaderData;

	return (
		<PendingUi
			as="section"
			className="grid grid-rows-[min-content_min-content_1fr_min-content] gap-y-6 contain-content"
		>
			<title>Rentals | Van Life</title>
			<meta content="View and manage your van rentals" name="description" />
			<VanHeader>Vans you are renting</VanHeader>

			<GenericComponent
				as="div"
				Component={VanCard}
				className="grid-max"
				emptyStateMessage="You are currently not renting any vans."
				errorStateMessage="Something went wrong"
				items={vans}
				renderKey={(van) => van.van.id}
				// TODO: consider if this needs an action
				renderProps={(van) => ({
					link: href('/host/vans/:vanSlug/:action?', {
						vanSlug: van.van.slug,
					}),
					van: van.van,
					linkCoversCard: false,
					action: (
						<div className="justify-self-end text-right">
							<CustomLink
								state={{
									van,
								}}
								to={href('/host/rentals/returnRental/:rentId', {
									rentId: van.id,
								})}
							>
								Return
							</CustomLink>
						</div>
					),
				})}
			/>
			<Pagination
				hasNextPage={hasNextPage}
				hasPreviousPage={hasPreviousPage}
				items={vans}
			/>
		</PendingUi>
	);
}
