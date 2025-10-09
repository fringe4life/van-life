import { useQueryStates } from 'nuqs';
import { data, href } from 'react-router';
import { getHostRentedVanCount, getHostRentedVans } from '~/db/rental/queries';
import { authContext } from '~/features/middleware/contexts/auth';
import { authMiddleware } from '~/features/middleware/functions/auth-middleware';
import CustomLink from '~/features/navigation/components/custom-link';
import { hasPagination } from '~/features/pagination/utils/has-pagination.server';
import VanCard from '~/features/vans/components/van-card';
import VanPages from '~/features/vans/components/van-pages';
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

	// Ensure vans is an array
	const vansArray = Array.isArray(vans) ? vans : [];

	return (
		<VanPages
			// generic component props start
			Component={VanCard}
			emptyStateMessage="You are currently not renting any vans."
			hasNextPage={hasNextPage}
			hasPreviousPage={hasPreviousPage}
			items={vansArray}
			optionalElement={
				<>
					<title>Rentals | Van Life</title>
					<meta content="View and manage your van rentals" name="description" />
				</>
			}
			// generic component props end

			// props for all use cases
			pathname={href('/host/rentals')}
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
			searchParams={{ cursor, limit }}
			title="Vans you are renting"
		/>
	);
}
