import clsx from 'clsx';
import { data, href, Outlet } from 'react-router';
import CustomLink from '~/components/CustomLink';
import VanDetailCard from '~/components/Van/HostVanDetailCard';
import { getHostVan } from '~/db/host/getHostVan';
import useIsNavigating from '~/hooks/useIsNavigating';
import { getSessionOrRedirect } from '~/lib/getSessionOrRedirect';
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
	if (!vanId) throw data('Van not found', { status: 404 });
	const van = await getHostVan(session.user.id, vanId);
	if (!van) throw data('Van not found', { status: 404 });

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
			<CustomLink
				to={href('/host/vans')}
				className="mt-4 mb-2 sm:mt-8 sm:mb-4 md:mt-15 md:mb-8"
			>
				&larr; Back to all vans
			</CustomLink>
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
