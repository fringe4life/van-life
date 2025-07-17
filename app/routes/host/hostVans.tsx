import { data, href } from 'react-router';
import CustomLink from '~/components/CustomLink';
import VanCard from '~/components/Van/VanCard';
import VanPages from '~/components/Van/VanPages';
import { getHostVanCount } from '~/db/host/getHostVanCount';
import { getHostVans } from '~/db/host/getHostVans';
import { getSessionOrRedirect } from '~/lib/auth/getSessionOrRedirect';
import { getPaginationParams } from '~/utils/getPaginationParams';
import type { Route } from './+types/hostVans';

export function meta() {
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

	const [vans, vansCount] = await Promise.all([
		getHostVans(session.user.id, page, limit),
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
			renderProps={(van) => ({
				link: href('/host/vans/:vanId', { vanId: van.id }),
				van,
				action: (
					<p className="justify-self-end">
						<CustomLink to={href('/host/vans/:vanId', { vanId: van.id })}>
							Edit
						</CustomLink>
					</p>
				),
			})}
			items={vans}
			itemsCount={vansCount}
			emptyStateMessage="You are currently not renting any vans."
			// generic component props end

			// props for all use cases
			pathname={href('/host/vans')}
			title="Your listed vans"
		/>
	);
}
