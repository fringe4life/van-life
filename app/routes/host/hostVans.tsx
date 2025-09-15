import { useQueryStates } from 'nuqs';
import { data, href } from 'react-router';
import { getHostVanCount, getHostVans } from '~/db/van/host';
import CustomLink from '~/features/navigation/components/CustomLink';
import { hasPagination } from '~/features/pagination/utils/hasPagination.server';
import VanCard from '~/features/vans/components/VanCard';
import VanPages from '~/features/vans/components/VanPages';
import { getSessionOrRedirect } from '~/lib/getSessionOrRedirect.server';
import { hostPaginationParsers } from '~/lib/parsers';
import { loadHostSearchParams } from '~/lib/searchParams.server';
import type { QueryType } from '~/types/types.server';
import type { Route } from './+types/hostVans';

export function meta() {
	return [
		{ title: 'Host Vans | Vanlife' },
		{
			name: 'description',
			content: 'Your dashboard page.',
		},
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
		getHostVans(session.user.id, cursor, limit, direction),
		getHostVanCount(session.user.id),
	]);

	const [vans, vansCount] = results.map((result) =>
		result.status === 'fulfilled'
			? result.value
			: 'There was an error getting this data.'
	);

	// Process pagination logic
	const pagination = hasPagination(vans, limit, cursor, direction);

	return data(
		{
			vansCount: vansCount as QueryType<typeof getHostVanCount>,
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
			className="grid-max"
			emptyStateMessage="You are currently not renting any vans."
			hasNextPage={hasNextPage}
			hasPreviousPage={hasPreviousPage}
			items={vansArray}
			// generic component props end

			// props for all use cases
			pathname={href('/host/vans')}
			renderKey={(van) => van.id}
			renderProps={(van) => ({
				link: href('/host/vans/:vanId', { vanId: van.id }),
				van,
				action: (
					<p className="text-right">
						<CustomLink to={href('/host/vans/:vanId', { vanId: van.id })}>
							Edit
						</CustomLink>
					</p>
				),
			})}
			searchParams={{ cursor, limit }}
			title="Your listed vans"
		/>
	);
}
