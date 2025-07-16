import { data, href } from 'react-router';
import CustomLink from '~/components/CustomLink';
import VanCard from '~/components/Van/VanCard';
import VanPages from '~/components/Van/VanPages';
import { getHostRentedVanCount } from '~/db/host/getHostRentedVanCount';
import { getHostRentedVans } from '~/db/host/getHostRentedVans';
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
		getHostRentedVanCount(session.user.id),
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

	const rentedVans = vans.filter((van) => !van.rentedTo);
	console.log({ vans, vansCount });
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
			items={rentedVans}
			itemsCount={vansCount}
			emptyStateMessage="You are currently not renting any vans."
			// generic component props end

			// props for all use cases
			pathname={href('/host/rentals')}
			title="Vans you are renting"
		/>
	);
}
