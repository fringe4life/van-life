import { data, href } from 'react-router';
import CustomLink from '~/components/CustomLink';
import VanCard from '~/components/Van/VanCard';
import VanPages from '~/components/Van/VanPages';
import { getHostRentedVans } from '~/db/host/getHostRentedVans';
import { getHostVanCount } from '~/db/host/getHostVanCount';
import { getSessionOrRedirect } from '~/lib/auth/getSessionOrRedirect';
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

export async function loader({ request }: Route.LoaderArgs) {
	const session = await getSessionOrRedirect(request);

	const { page, limit } = getPaginationParams(request.url);
	const vans = await getHostRentedVans(session.user.id, page, limit);
	const vansCount = await getHostVanCount(session.user.id);

	return data(
		{
			vans,
			vansCount,
		},
		{
			headers: {
				'Cache-Control': 'max-age=259200',
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
				link: href('/host/vans/:vanId', { vanId: van.id }),
				van: van.van,
				linkCoversCard: false,
				action: (
					<CustomLink
						state={{
							hostId: van.hostId,
							rentedAt: van.rentedAt,
							amount: van.rentedAt,
						}}
						to={href('/host/rentals/:vanId', { vanId: van.van.id })}
					>
						Return
					</CustomLink>
				),
			})}
			items={vans}
			itemsCount={vansCount}
			emptyStateMessage="You are currently not renting any vans."
			// generic component props end
			// used for discriminated union in case needed and to manage vans route
			variant="host"
			// props for all use cases
			path={href('/host/rentals')}
			title="Vans you are renting"
		/>
	);
}
