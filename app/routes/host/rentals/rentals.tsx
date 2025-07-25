import { data, href } from 'react-router';
import CustomLink from '~/components/CustomLink';
import VanCard from '~/components/Van/VanCard';
import VanPages from '~/components/Van/VanPages';
import { getHostRentedVanCount } from '~/db/host/getHostRentedVanCount';
import { getHostRentedVans } from '~/db/host/getHostRentedVans';
import { getSessionOrRedirect } from '~/lib/getSessionOrRedirect.server';
import { getPaginationParams } from '~/utils/getPaginationParams';
import type { Route } from './+types/rentals';

export function meta() {
	return [
		{ title: 'Rented Vans | Vanlife' },
		{
			name: 'description',
			content: 'The vans you are currently renting',
		},
	];
}

export function headers({ actionHeaders, loaderHeaders }: Route.HeadersArgs) {
	return actionHeaders ? actionHeaders : loaderHeaders;
}

export async function loader({ request }: Route.LoaderArgs) {
	const { session, headers } = await getSessionOrRedirect(request);

	const { page, limit } = getPaginationParams(request.url);

	const results = await Promise.allSettled([
		getHostRentedVans(session.user.id, page, limit),
		getHostRentedVanCount(session.user.id),
	]);

	const [vans, vansCount] = results.map((result) =>
		result.status === 'fulfilled' ? result.value : 'Error fetching data',
	);

	return data(
		{
			vans: vans as Awaited<ReturnType<typeof getHostRentedVans>> | string, // or Van[] | string
			vansCount: vansCount as
				| Awaited<ReturnType<typeof getHostRentedVanCount>>
				| string, // or number | string
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
	const { vans, vansCount } = loaderData;

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
			items={vans}
			itemsCount={vansCount}
			emptyStateMessage="You are currently not renting any vans."
			// generic component props end

			// props for all use cases
			pathname={href('/host/rentals')}
			title="Vans you are renting"
		/>
	);
}
