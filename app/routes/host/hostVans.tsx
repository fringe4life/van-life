import { data, href, Link } from 'react-router';
import VanCard from '~/components/Van/VanCard';
import VanPages from '~/components/Van/VanPages';
import { getHostVanCount } from '~/db/getHostVanCount';
import { getHostVans } from '~/db/getHostVans';
import { getSessionOrRedirect } from '~/lib/auth/getSessionOrRedirect';
import { getPaginationParams } from '~/utils/getPaginationParams';
import type { Route } from './+types/hostVans';

export function meta(_: Route.MetaArgs) {
	return [
		{ title: 'Host Vans | Vanlife' },
		{
			name: 'description',
			content: 'the dashboard page whe you are logged in',
		},
	];
}

export async function loader({ request }: Route.LoaderArgs) {
	const session = await getSessionOrRedirect(request);

	const { page, limit } = getPaginationParams(request.url);
	const vans = await getHostVans(session.user.id, page, limit);
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
			renderKey={(van) => van.id}
			renderProps={(van) => ({
				link: href('/host/vans/:vanId', { vanId: van.id }),
				van,
				action: (
					<Link to={href('/host/vans/:vanId', { vanId: van.id })}>Edit</Link>
				),
			})}
			items={vans}
			itemsCount={vansCount}
			// generic component props end
			// used for discriminated union in case needed and to manage vans route
			variant="host"
			// props for all use cases
			path={href('/host/vans')}
			title="Your listed vans"
		/>
	);
}
