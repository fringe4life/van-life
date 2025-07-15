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

	const [vans, vansCount] = await Promise.all([
		getHostRentedVans(session.user.id, page, limit),
		getHostVanCount(session.user.id),
	]);

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
			renderKey={(van) => van.id}
			renderProps={(rent) => ({
				link: href('/host/vans/:vanId', { vanId: rent.van.id }),
				van: rent.van,
				linkCoversCard: false,
				action: (
					<div className="justify-self-end">
						<CustomLink
							state={{
								rent,
							}}
							to={href('/host/rentals/rent/:vanId', { vanId: rent.vanId })}
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
			// used for discriminated union in case needed and to manage vans route
			variant="host"
			// props for all use cases
			path={href('/host/rentals')}
			title="Vans you are renting"
		/>
	);
}
