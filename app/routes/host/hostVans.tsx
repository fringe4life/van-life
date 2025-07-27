import { data, href } from 'react-router';
import CustomLink from '~/components/navigation/CustomLink';
import VanCard from '~/components/van/VanCard';
import VanPages from '~/components/van/VanPages';
import { getHostVanCount } from '~/db/host/getHostVanCount';
import { getHostVans } from '~/db/host/getHostVans';
import { getPaginationParams } from '~/lib/getPaginationParams.server';
import { getSessionOrRedirect } from '~/lib/getSessionOrRedirect.server';
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

export function headers({ actionHeaders, loaderHeaders }: Route.HeadersArgs) {
	return actionHeaders ? actionHeaders : loaderHeaders;
}

export async function loader({ request }: Route.LoaderArgs) {
	const { session, headers } = await getSessionOrRedirect(request);

	const { page, limit } = getPaginationParams(request.url);

	const results = await Promise.allSettled([
		getHostVans(session.user.id, page, limit),
		getHostVanCount(session.user.id),
	]);

	const [vans, vansCount] = results.map((result) =>
		result.status === 'fulfilled'
			? result.value
			: 'There was an error getting this data.',
	);

	return data(
		{
			vans: vans as Awaited<ReturnType<typeof getHostVans>>,
			vansCount: vansCount as Awaited<ReturnType<typeof getHostVanCount>>,
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
			className="grid-max"
			Component={VanCard}
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
