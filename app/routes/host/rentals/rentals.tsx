import { useQueryStates } from 'nuqs';
import { data, href } from 'react-router';
import CustomLink from '~/components/navigation/CustomLink';
import VanCard from '~/components/van/VanCard';
import VanPages from '~/components/van/VanPages';
import { getHostRentedVanCount, getHostRentedVans } from '~/db/rental/queries';
import { getSessionOrRedirect } from '~/lib/getSessionOrRedirect.server';
import { hasPagination } from '~/lib/hasPagination.server';
import { hostPaginationParsers } from '~/lib/parsers';
import { loadHostSearchParams } from '~/lib/searchParams.server';
import type { QueryType } from '~/types/types.server';
import type { Route } from './+types/rentals';

export function meta() {
	return [
		{ title: 'Rentals | Van Life' },
		{ name: 'description', content: 'Your van rentals' },
	];
}

export function headers({ actionHeaders, loaderHeaders }: Route.HeadersArgs) {
	return actionHeaders ? actionHeaders : loaderHeaders;
}

export async function loader({ request }: Route.LoaderArgs) {
	const { session, headers } = await getSessionOrRedirect(request);

	// Parse search parameters using nuqs loadHostSearchParams
	const { cursor, limit, direction } = loadHostSearchParams(request);

	const results = await Promise.allSettled([
		getHostRentedVans(session.user.id, cursor, limit, direction),
		getHostRentedVanCount(session.user.id),
	]);

	const [vans, vansCount] = results.map((result) =>
		result.status === 'fulfilled' ? result.value : 'Error fetching data',
	);

	// Process pagination logic
	const pagination = hasPagination(vans, limit, cursor, direction);

	return data(
		{
			vansCount: vansCount as QueryType<typeof getHostRentedVanCount>,
			...pagination,
		},
		{
			headers: {
				'Cache-Control': 'max-age=259200',
				...headers,
			},
		},
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
			renderKey={(van) => van.van.id}
			renderProps={(van) => ({
				link: href('/host/vans/:vanId', { vanId: van.van.id }),
				van: van.van,
				linkCoversCard: false,
				action: (
					<div className="justify-self-end">
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
			items={vansArray}
			emptyStateMessage="You are currently not renting any vans."
			// generic component props end

			// props for all use cases
			pathname={href('/host/rentals')}
			title="Vans you are renting"
			searchParams={{ cursor, limit }}
			hasNextPage={hasNextPage}
			hasPreviousPage={hasPreviousPage}
		/>
	);
}
