import { useQueryStates } from 'nuqs';
import { data, href } from 'react-router';
import GenericComponent from '~/components/generic-component';
import PendingUi from '~/components/pending-ui';
import { getHostRentedVanCount, getHostRentedVans } from '~/db/rental/queries';
import { authContext } from '~/features/middleware/contexts/auth';
import { authMiddleware } from '~/features/middleware/functions/auth-middleware';
import CustomLink from '~/features/navigation/components/custom-link';
import Pagination from '~/features/pagination/components/pagination';
import { DEFAULT_LIMIT } from '~/features/pagination/pagination-constants';
import { hasPagination } from '~/features/pagination/utils/has-pagination.server';
import VanCard from '~/features/vans/components/van-card';
import VanHeader from '~/features/vans/components/van-header';
import { hostPaginationParsers } from '~/lib/parsers';
import { loadHostSearchParams } from '~/lib/search-params.server';
import { tryCatch } from '~/utils/try-catch.server';
import type { Route } from './+types/rentals';

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export async function loader({ request, context }: Route.LoaderArgs) {
	const session = context.get(authContext);

	// Parse search parameters using nuqs loadHostSearchParams
	const { cursor, limit, direction } = loadHostSearchParams(request);

	const [vansResult, countResult] = await Promise.all([
		tryCatch(
			async () =>
				await getHostRentedVans(session.user.id, cursor, limit, direction)
		),
		tryCatch(async () => await getHostRentedVanCount(session.user.id)),
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

export default function Host({ loaderData }: Route.ComponentProps) {
	const { actualItems: vans, hasNextPage, hasPreviousPage } = loaderData;

	// Use nuqs for client-side state management
	const [{ cursor, limit }] = useQueryStates(hostPaginationParsers);
	const effectiveLimit = limit ?? DEFAULT_LIMIT;

	// Ensure vans is an array
	const vansArray = Array.isArray(vans) ? vans : [];

	return (
		<PendingUi
			as="section"
			className="grid grid-rows-[min-content_min-content_1fr_min-content] contain-content"
		>
			<VanHeader>Vans you are renting</VanHeader>

			<title>Rentals | Van Life</title>
			<meta content="View and manage your van rentals" name="description" />

			<GenericComponent
				as="div"
				Component={VanCard}
				className="grid-max mt-6"
				emptyStateMessage="You are currently not renting any vans."
				items={vansArray}
				renderKey={(van) => van.van.id}
				// TODO: consider if this needs an action
				renderProps={(van) => ({
					link: href('/host/vans/:vanSlug?/:action?', {
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
				cursor={cursor}
				hasNextPage={hasNextPage}
				hasPreviousPage={hasPreviousPage}
				items={vansArray}
				limit={effectiveLimit}
				pathname={href('/host/rentals')}
			/>
		</PendingUi>
	);
}
