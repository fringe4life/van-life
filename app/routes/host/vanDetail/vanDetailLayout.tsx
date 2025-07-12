import clsx from 'clsx';
import { data, href, Link, Outlet, redirect } from 'react-router';
import VanDetailCard from '~/components/Van/HostVanDetailCard';
import { getHostVan } from '~/db/getHostVan';
import useIsNavigating from '~/hooks/useIsNavigating';
import { getSessionOrRedirect } from '~/lib/auth/getSessionOrRedirect';
import type { Route } from './+types/vanDetailLayout';
export function meta({ data }: Route.MetaArgs) {
	return [
		{ title: `${data?.van?.name ?? 'unknown'} | Vanlife` },
		{
			name: 'details',
			content: `The details about ${data?.van?.name ?? 'unknown'} van`,
		},
	];
}

export async function loader({ request, params }: Route.LoaderArgs) {
	const session = await getSessionOrRedirect(request);
	const { vanId } = params;
	if (!vanId) throw redirect('/notfound');
	const van = await getHostVan(session.user.id, vanId);
	if (!van) throw redirect('/notfound');

	return data(
		{
			van,
		},
		{
			headers: {
				'Cache-Control': 'max-age=259200',
			},
		},
	);
}

export default function VanDetailLayout({ loaderData }: Route.ComponentProps) {
	const { van } = loaderData;
	const { changingPage } = useIsNavigating();
	return (
		<>
			<Link to={href('/host/vans')} className="mt-15 mb-8">
				&larr; Back to all vans
			</Link>
			<VanDetailCard van={van}>
				<div
					className={clsx({
						'opacity-50': changingPage,
					})}
				>
					<Outlet context={van} />
				</div>
			</VanDetailCard>
		</>
	);
}
