import { useQueryStates } from 'nuqs';
import { data, href } from 'react-router';
import { getHostRentedVanCount, getHostRentedVans } from '~/db/rental/queries';
import CustomLink from '~/features/navigation/components/CustomLink';
import { hasPagination } from '~/features/pagination/utils/hasPagination.server';
import VanCard from '~/features/vans/components/VanCard';
import VanPages from '~/features/vans/components/VanPages';
import { getSessionOrRedirect } from '~/lib/getSessionOrRedirect.server';
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
	const { session, headers: cookies } = await getSessionOrRedirect(request);

	// Parse search parameters using nuqs loadHostSearchParams
	const { cursor, limit, direction } = loadHostSearchParams(request);

	const results = await Promise.allSettled([
		getHostRentedVans(session.user.id, cursor, limit, direction),
		getHostRentedVanCount(session.user.id),
	]);

	const [vans, vansCount] = results.map((result) =>
		result.status === 'fulfilled' ? result.value : 'Error fetching data'
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
				...cookies,
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
			// generic component props end

			// props for all use cases
			pathname={href('/host/rentals')}
			renderKey={(van) => van.van.id}
			renderProps={(van) => ({
				link: href('/host/vans/:vanId', { vanId: van.van.id }),
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
